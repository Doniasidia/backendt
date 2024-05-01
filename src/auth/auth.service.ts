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
  ) {}

  async signIn(emailOrTelephone: string, password: string): Promise<{ access_token: string, role: Role, redirectTo: string }> {
    let user;

    // Assuming clients are identified by email
    user = await this.clientRepository.findOneByEmailOrTelephone(emailOrTelephone);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare hashed password with the received password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Construct payload and return access token along with redirect URL
    const payload = { sub: user.id, username: user.username, role: user.role };
    let redirectTo = '/client/dashboard'; // Default redirect URL for clients
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: user.role,
      redirectTo: redirectTo,
    };
  }
}
