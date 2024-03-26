// client.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '@admin/client/client.entity';
import { ClientService } from '@admin/client/clients.service';
import { ClientController } from '@admin/client/clients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}