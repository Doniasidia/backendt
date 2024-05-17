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
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from '@entity/emailverification.entity';
import { ConfigModule } from '@nestjs/config';
import { SubscriberModule } from '@client/subscribers/subscribers.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ envFilePath: '.env', }),
    TypeOrmModule.forFeature([EmailVerification]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100000s' },
    }),
  ],
  providers: [AuthService, JwtStrategy, UserService, Repository, UserRepository, ClientRepository, AdminRepository, SubscriberRepository,],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }