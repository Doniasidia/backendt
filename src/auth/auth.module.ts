import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { UserModule } from '@user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@auth/auth.controller';
import { jwtConstants } from '@auth/constants';
import { JwtStrategy } from '@auth/jwt.strategy';
import { UserService } from '@user/user.service';
import { Repository } from 'typeorm';
import { UserRepository } from '@user/user.repository';
import { ClientRepository } from '@user/client.repository';
import { AdminRepository } from '@user/admin.repository';
import { SubscriberRepository } from '@user/subscriber.repository';

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