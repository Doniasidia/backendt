import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AdminRepository } from "@user/admin.repository";
import { ClientRepository } from "@user/client.repository";
import { SubscriberRepository } from "@user/subscriber.repository";
import { UserService } from "@user/user.service";
import { Role } from '@enums/role';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private clientRepository: ClientRepository,
    private adminRepository: AdminRepository,
    private subscriberRepository: SubscriberRepository,
  ) { }

  async signIn(email: string, password: string): Promise<{ access_token: string, role: Role, redirectTo: string, username: string, userId: number }> {
    let user;
    let role ; // Default role
    let redirectTo = '/login'; // Default redirect URL

    // Check if user exists in admin repository
    user = await this.adminRepository.findOneByEmail(email);
    if (user) {
        role = Role.ADMIN;
        redirectTo = '/admin/dashboard';
    } else {
        // If user doesn't exist in admin repository, check subscriber repository
        user = await this.subscriberRepository.findOneByEmail(email);
        if (user) {
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

    // Compare hashed password with the received password
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
}
