// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from 'src/entity/calendar';
import { Invoice } from 'src/entity/invoice';
import { Message } from 'src/entity/message';
import { Payment } from 'src/entity/payment';
import { Subplan } from 'src/entity/subplan';
import { Subscription } from 'src/client/subscription/subscription';
import { Sessions } from 'src/entity/sessions';
import { Subscriber } from 'src/client/subscriber/subscriber';
import { Client } from './admin/client/client.entity';
import { Admin } from 'src/entity/admin';
import { User } from 'src/user/user';

import { ClientService } from './admin/client/clients.service';
import { ClientController } from './admin/client/clients.controller';
import { ClientModule } from './admin/client/clients.module';
import { AuthModule } from './auth/auth.module';
import { Repository } from 'typeorm';
import { UserRepository } from './user/user.repository';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ClientRepository } from './user/client.repository';
import { AdminRepository } from './user/admin.repository';
import { SubscriberRepository } from './user/subscriber.repository';




@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          Calendar,
          Invoice,
          Message,
          Payment,
          Sessions,
          Subplan,
          Subscription,
          Subscriber,
          Client,
          Admin,
          User
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ClientModule,AuthModule,UserModule,
  ],
  controllers: [AppController, ClientController],
  providers: [AppService, ClientService, Repository,UserRepository,UserService,ClientRepository,AdminRepository,SubscriberRepository],
})
export class AppModule {}

