// jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { jwtConstants } from '@auth/constants';
import { UserService } from '@user/user.service';
import { ClientRepository } from '@user/client.repository';
import { AdminRepository } from '@user/admin.repository';
import { SubscriberRepository } from '@user/subscriber.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly clientRepository: ClientRepository,
    private readonly adminRepository: AdminRepository,
    private readonly subscriberRepository: SubscriberRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    let user;

    switch (payload.role) {
      case 'client':
        user = await this.clientRepository.findOneByEmailOrTelephone(payload.sub);
        break;
      case 'admin':
        user = await this.adminRepository.findOneByEmailOrTelephone(payload.sub);
        break;
      case 'subscriber':
        user = await this.subscriberRepository.findOneByEmailOrTelephone(payload.sub);
        break;
    
    }

    return user;
  }
}
