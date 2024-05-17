//authservice
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AdminRepository } from "@user/admin.repository";
import { ClientRepository } from "@user/client.repository";
import { Role } from '@enums/role';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from '@entity/emailverification.entity';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { SubscriberRepository } from '@user/subscriber.repository';

@Injectable()
export class AuthService {
    transport: any;
    constructor(
        private jwtService: JwtService,
        private clientRepository: ClientRepository,
        private adminRepository: AdminRepository,
        private subscriberRepository: SubscriberRepository,
        @InjectRepository(EmailVerification)
        private readonly emailVerificationRepository: Repository<EmailVerification>
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
                }}}
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

    async createEmailToken(email: string): Promise<number> {
        const subscriber = await this.subscriberRepository.findOneByEmail(email);

        let emailVerification = new EmailVerification();
        emailVerification.subscriber = subscriber;
        emailVerification.token = Math.floor(Math.random() * (9000000)) + 1000000;
        emailVerification.timestamp = new Date();
        emailVerification.email = subscriber.email;
        emailVerification.emailToken = emailVerification.token;
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

    async sendVerifyEmail(email: string, token: number): Promise<boolean> {
        let verifyUrl = `${process.env.REDIRECT_HOST}/confirmationmdp?token=${token}&email=${email}`;
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

    async verifyEmail(token: number): Promise<boolean> {
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

    async emailResetedPassword(email: string, password: string): Promise<boolean> {

        let htmlContent = "<p>Your new password is: " + password + " </p>";
        htmlContent += '<p>Please do not reply to this notification, this inbox is not monitored.</p>';
        htmlContent += '<p>If you are having a problem with your account, please email ' + process.env.CONTACT_EMAIL + '</p>';
        htmlContent += '<p>Thanks for using the app</p>';

        var mailOptions = {
            from: process.env.CONTACT_EMAIL,
            to: email,
            subject: 'Usms forgotten password confirmation',
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
    async forgotPassword(email: string): Promise<void> {
        const user = await this.subscriberRepository.findOneByEmail(email);
        if (!user) {
          throw new UnauthorizedException("User not found");
        }
        const resetTokenSubscriber = await this.createEmailToken(email); // Rename variable to avoid redeclaration
        const sentSubscriber = await this.sendVerifyEmail(email, resetTokenSubscriber); // Rename variable to avoid redeclaration
        if (!sentSubscriber) {
          throw new UnauthorizedException("Failed to send reset email");
        }
    
        const client = await this.clientRepository.findOneByEmail(email); // Rename variable to avoid redeclaration
        if (!client) {
            throw new UnauthorizedException("User not found");
        }
        const resetTokenClient = await this.createEmailToken(email); // Rename variable to avoid redeclaration
        const sentClient = await this.sendVerifyEmail(email, resetTokenClient); // Rename variable to avoid redeclaration
        if (!sentClient) {
            throw new UnauthorizedException("Failed to send reset email");
        }
    }
    
      
    /* async sendVerificationEmail(email: string, token: number): Promise<boolean> {
        // Construct verification link with token
        const verifyUrl = `${process.env.REDIRECT_HOST}/verify-email/${token}`;
        
        // Compose email content
        const htmlContent = `
            <p>Click the following link to verify your email:</p>
            <a href="${verifyUrl}">${verifyUrl}</a>
        `;
    
        // Send the email using your email service
        try {
            const sent = await this.sendEmail(email, "Email Verification", htmlContent);
            return sent; // Return the result of sending the email
        } catch (error) {
            console.error("Error sending verification email:", error);
            return false; // Return false if an error occurs
        }
    }
    async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
        // Implement logic to send email using nodemailer or your email service
        // For example:
        const mailOptions = {
            from: process.env.CONTACT_EMAIL,
            to: to,
            subject: subject,
            html: htmlContent,
        };
    
        try {
            const sent = await new Promise<boolean>((resolve, reject) => {
                return this.transport.sendMail(mailOptions, (error: any, info: any) => {
                    if (error) {
                        console.error("Error sending email:", error);
                        return reject(false);
                    }
                    resolve(true);
                });
            });
            return sent;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }
  // AuthService - verifyEmail method
// AuthService - verifyEmail method
async verifiEmail(token: number): Promise<boolean> {
    // Find email verification record by token
    const emailVerification = await this.emailVerificationRepository.findOne({ where: { token: token } });
    if (emailVerification && emailVerification.email) {
        // Find user by email
        const userData = await this.subscriberRepository.findOneByEmail(emailVerification.email);
        if (userData) {
            // Mark user as verified
            userData.is_verified = true;
            const savedUser = await this.subscriberRepository.save(userData);
            await this.emailVerificationRepository.delete({ token: token });
            console.log('User verified:', savedUser);
            return true; // User verified successfully
        }
    } else {
        // Email verification record not found
        console.error('Invalid email verification token:', token);
        return false; // Verification failed
    }
}

async createEmaiToken(email: string): Promise<number> {
    // Generate a random verification token
    const token = Math.floor(Math.random() * (9000000)) + 1000000;
    
    // Save the token in the database along with the subscriber's email
    // You can use your existing EmailVerification entity for this
    const emailVerification = new EmailVerification();
    emailVerification.email = email;
    emailVerification.token = token;
    await this.emailVerificationRepository.save(emailVerification);
    
    return token;
}     

async sendVerifiEmail(email: string, token: number): Promise<boolean> {
    // Construct verification URL with token appended
    const verifyUrl = `${process.env.REDIRECT_HOST}/login?token=${token}`;
    
    // Compose email content
    const htmlContent = `
        <p>Click the following link to verify your email:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
    `;
    
    // Send the email using your email service
    try {
        const sent = await this.sendEmail(email, "Email Verification", htmlContent);
        return sent; // Return the result of sending the email
    } catch (error) {
        console.error("Error sending verification email:", error);
        return false; // Return false if an error occurs
    }
}
*/
}
