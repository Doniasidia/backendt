import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { ClientService } from '@admin/client/clients.service';

@Module({
  providers: [ChatGateway, SubscriberService, ClientService],
})
export class ChatModule {}
