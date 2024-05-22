// client.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '@admin/client/client.entity';
import { ClientService } from '@admin/client/clients.service';
import { ClientController } from '@admin/client/clients.controller';
import { AuthModule } from '@auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@auth/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), AuthModule, JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '100000s' },
  }),],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule { }