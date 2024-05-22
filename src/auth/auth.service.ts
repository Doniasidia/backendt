//authservice
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AdminRepository } from "@user/admin.repository";
import { ClientRepository } from "@user/client.repository";
import { Role } from '@enums/role';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from '@entity/emailverification.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberRepository } from '@user/subscriber.repository';
import { ForgotPassword } from '@entity/forgotpassword.entity';

@Injectable()
export class AuthService {
    transport: any;
    constructor(
        private jwtService: JwtService,
        private clientRepository: ClientRepository,
        private adminRepository: AdminRepository,
        private subscriberRepository: SubscriberRepository,
        @InjectRepository(EmailVerification)
        private readonly emailVerificationRepository: Repository<EmailVerification>,
        @InjectRepository(ForgotPassword)
        private readonly forgotPasswordRepository: Repository<ForgotPassword>,
    ) {
        this.transport = nodemailer.createTransport(smtpTransport({
            service: "Gmail",
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
        }));
    }

    async signIn(email: string, password: string): Promise<{ access_token: string, role: Role, redirectTo: string, username: string, userId: number }> {
        let user;
        let role; // Default role
        let redirectTo = '/login'; // Default redirect URL
        user = await this.adminRepository.findOneByEmail(email);
        if (user) {
            role = Role.ADMIN;
            redirectTo = '/admin/dashboard';
        } else {
            user = await this.subscriberRepository.findOneByEmail(email);
            if (user) {
                if (!user.is_verified) {
                    throw new UnauthorizedException('User need to mail verify');
                }
                role = Role.SUBSCRIBER;
                redirectTo = '/subs/abonnements'; // Redirect URL for subscribers
            } else {
                // If user doesn't exist in subscriber repository, check client repository
                user = await this.clientRepository.findOneByEmail(email);
                if (user) {
                    role = Role.CLIENT;
                    redirectTo = '/client/dashboard'; // Redirect URL for clients
                }
            }
        }
        if (!user) {
            // If user doesn't exist in any repository, throw UnauthorizedException
            throw new UnauthorizedException('Invalid credentials');
        }
        let isPasswordValid = await bcrypt.compare(password, user.password);

        // If the hashed password doesn't match, check if the password is plain text
        if (!isPasswordValid) {
            // Check if the received password matches the plain-text password stored in the database
            isPasswordValid = password === user.password;
        }

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Construct payload and return access token along with redirect URL
        const payload = { sub: user.id, username: user.username, role, userId: user.id }; // Include userId in the payload

        return {
            access_token: await this.jwtService.signAsync(payload),
            role,
            redirectTo,
            username: user.username,
            userId: user.id // Include userId in the response
        };
    }

    async createEmailToken(email: string, isClient: boolean = false): Promise<number> {
        let user: any;
        let emailVerification = new EmailVerification();

        if (isClient) {
            user = await this.clientRepository.findOneByEmail(email)
            emailVerification.client = user;
        } else {
            user = await this.subscriberRepository.findOneByEmail(email)
            emailVerification.subscriber = user;
        }

        emailVerification.token = Math.floor(Math.random() * (9000000)) + 1000000;
        emailVerification.timestamp = new Date();
        emailVerification.email = user.email;
        await this.emailVerificationRepository.save(emailVerification);

        return emailVerification.token;
    }

    async recreateEmailToken(subscriber: Subscriber): Promise<number> {
        const emailVerification = await this.emailVerificationRepository.findOne({ where: { subscriber: subscriber } });

        if (!emailVerification) {
            return -1;
        } else {

            emailVerification.token = Math.floor(Math.random() * (9000000)) + 1000000;
            emailVerification.timestamp = new Date();
            await this.emailVerificationRepository.update(emailVerification.id, emailVerification);

            return emailVerification.token;
        }
    }

    async sendVerifyEmail(email: string, token: number, isClient: boolean = false): Promise<boolean> {
        let verifyUrl = `${process.env.REDIRECT_HOST}/confirmationmdp?token=${token}&email=${email}&client=${isClient}`;
        let htmlContent = "<p>Visit this link to verify your email address:</p>";
        htmlContent += '<a href=' + verifyUrl + '>' + verifyUrl + '</a>';
        htmlContent += '<p>Please do not reply to this notification, this inbox is not monitored.</p>';
        htmlContent += '<p>If you are having a problem with your account, please email ' + process.env.CONTACT_EMAIL + '</p>';
        htmlContent += '<p>Thanks for using the Usms</p>';

        var mailOptions = {
            from: process.env.CONTACT_EMAIL,
            to: email,
            subject: 'Usms verify your email address', // Subject line
            text: 'Hello world', // plaintext body
            html: htmlContent,
        };

        let authService = this;
        try {
            var sent = await new Promise<boolean>(async function (resolve, reject) {
                return await authService.transport.sendMail(mailOptions, async (error: any, info: any) => {
                    if (error) {
                        return reject(false);
                    }
                    resolve(true);
                });
            })
            return sent;
        } catch (error) {
            return false;
        }

    }

    async verifySubscriberEmail(token: number): Promise<boolean> {
        const emailVerification = await this.emailVerificationRepository.findOne({ where: { token: token } });
        if (emailVerification && emailVerification.email) {
            const userData = await this.subscriberRepository.findOneByEmail(emailVerification.email);
            if (userData) {
                userData.is_verified = true;
                const savedUser = await this.subscriberRepository.save(userData);
                await this.emailVerificationRepository.delete({ token: token });
                console.log(!!savedUser, !!savedUser.is_verified);
                return !!savedUser;
            }
        } else {
            throw new HttpException('LOGIN.EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
        }
        return true;
    }

    async verifyClientEmail(token: number): Promise<boolean> {
        const emailVerification = await this.emailVerificationRepository.findOne({ where: { token: token } });
        if (emailVerification && emailVerification.email) {
            const userData = await this.clientRepository.findOneByEmail(emailVerification.email);
            if (userData) {
                userData.is_verified = true;
                const savedUser = await this.clientRepository.save(userData);
                await this.emailVerificationRepository.delete({ token: token });
                console.log(!!savedUser, !!savedUser.is_verified);
                return !!savedUser;
            }
        } else {
            throw new HttpException('LOGIN.EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
        }
        return true;
    }

    async sendEmailForgotPassword(email: string): Promise<boolean> {
        let authService = this;
        let isClient = false;
        let userData: any = await this.subscriberRepository.findOneByEmail(email);

        if (!userData) {
            userData = await this.clientRepository.findOneByEmail(email);
            isClient = true;
        }
        if (!userData) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

        let tokenModel: ForgotPassword;

        if (isClient) {
            tokenModel = await this.createClientForgottenPasswordToken(email)
        } else {
            tokenModel = await this.createSubscriberForgottenPasswordToken(email)
        }

        if (tokenModel && tokenModel.token) {

            let url = `${process.env.REDIRECT_HOST}/reset-password?token=${tokenModel.token}&client=${isClient}`;


            let mailOptions = {
                from: process.env.CONTACT_EMAIL,
                to: email, // list of receivers (separated by ,)
                subject: 'USMS Reset password code',
                text: 'Forgot Password',
                html: 'Hello <br><br> We have received a request to reset your password for your account with email : <strong>'
                    + email + '</strong><br/><br/>'
                    + "If you didn't make this request, please disregard this email or contact our support team at <strong>" + process.env.CONTACT_EMAIL + "</strong>.<br/><br/> Otherwise, you can reset your password using this link:<br/><br/>"
                    + '<a href=' + url + '>' + url + '</a>'  // html body
            };

            var sended = await new Promise<boolean>(async function (resolve, reject) {
                return authService.transport.sendMail(mailOptions, async (error: any, info: any) => {
                    if (error) {
                        console.log('Message sent: %s', error);
                        return reject(false);
                    }
                    console.log('Message sent: %s', info.messageId);
                    resolve(true);
                });
            })

            return sended;
        } else {
            throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
        }
    }

    async createSubscriberForgottenPasswordToken(email: string): Promise<ForgotPassword> {
        let userData = await this.subscriberRepository.findOneByEmail(email);
        let forgotPassword = await this.forgotPasswordRepository.findOne({ where: { subscriber: userData } });
        if (forgotPassword && ((new Date().getTime() - forgotPassword.timestamp.getTime()) / 60000 < 15)) {
            throw new HttpException('RESET_PASSWORD.EMAIL_SENDED_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {

            if (!forgotPassword) {
                forgotPassword = new ForgotPassword();
                forgotPassword.subscriber = userData;
            }

            forgotPassword.token = Math.floor(Math.random() * (9000000)) + 1000000;
            forgotPassword.timestamp = new Date();

            let ret = await this.forgotPasswordRepository.save(forgotPassword);

            if (ret) {
                return ret;
            } else {
                throw new HttpException('LOGIN.ERROR.GENERIC_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


    async createClientForgottenPasswordToken(email: string): Promise<ForgotPassword> {
        let userData = await this.clientRepository.findOneByEmail(email);
        let forgotPassword = await this.forgotPasswordRepository.findOne({ where: { client: userData } });
        if (forgotPassword && ((new Date().getTime() - forgotPassword.timestamp.getTime()) / 60000 < 15)) {
            throw new HttpException('RESET_PASSWORD.EMAIL_SENDED_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {

            if (!forgotPassword) {
                forgotPassword = new ForgotPassword();
                forgotPassword.client = userData;
            }

            forgotPassword.token = Math.floor(Math.random() * (9000000)) + 1000000;
            forgotPassword.timestamp = new Date();

            let ret = await this.forgotPasswordRepository.save(forgotPassword);

            if (ret) {
                return ret;
            } else {
                throw new HttpException('LOGIN.ERROR.GENERIC_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async subscriberResetPassword(token: number, password: string): Promise<UpdateResult> {
        try {
            let forgotPassword = await this.forgotPasswordRepository.findOne({ relations: ["subscriber"], where: { token: token } });
            if (forgotPassword.subscriber) {
                forgotPassword.subscriber.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                const update = await this.subscriberRepository.update(forgotPassword.subscriber);
                await this.forgotPasswordRepository.delete({ token: token });
                return update;
            } else {
                throw new HttpException('LOGIN.ERROR.RESULT_FAIL', HttpStatus.UNAUTHORIZED);
            }

        } catch (error) {
            throw new HttpException('LOGIN.ERROR.RESULT_FAIL', HttpStatus.UNAUTHORIZED);
        }
    }

    async clientResetPassword(token: number, password: string): Promise<UpdateResult> {
        try {
            let forgotPassword = await this.forgotPasswordRepository.findOne({ relations: ["client"], where: { token: token } });
            if (forgotPassword.client) {
                forgotPassword.client.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                const update = await this.clientRepository.update(forgotPassword.client);
                await this.forgotPasswordRepository.delete({ token: token });
                return update;
            } else {
                throw new HttpException('LOGIN.ERROR.RESULT_FAIL', HttpStatus.UNAUTHORIZED);
            }

        } catch (error) {
            throw new HttpException('LOGIN.ERROR.RESULT_FAIL', HttpStatus.UNAUTHORIZED);
        }
    }
}
