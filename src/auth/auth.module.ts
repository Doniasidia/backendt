import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { UserRepository } from 'src/user/user.repository';
import { ClientRepository } from 'src/user/client.repository';
import { AdminRepository } from 'src/user/admin.repository';
import { SubscriberRepository } from 'src/user/subscriber.repository';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '120s' },
    }),
  ],
  providers: [AuthService, JwtStrategy, UserService,Repository,UserRepository,ClientRepository,AdminRepository,SubscriberRepository],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}