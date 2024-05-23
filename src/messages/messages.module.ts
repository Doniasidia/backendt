import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { ChatService } from './messages.service';
import { Messages } from './messages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@auth/constants';
import { ChatController } from './messages.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Messages]), AuthModule, JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '100000s' },
  }),],
  providers: [MessagesGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule { }
