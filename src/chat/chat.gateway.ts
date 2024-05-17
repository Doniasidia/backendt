import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable,OnModuleInit } from '@nestjs/common';
import { SubscriberService } from '@client/subscribers/subscribers.service';
import { ClientService } from '@admin/client/clients.service';
import { Message } from './message.interface';

@WebSocketGateway({ cors: true })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly subscriberService: SubscriberService,
    private readonly clientService: ClientService
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log('Client connected!', socket.id);
    });
  }

  async handleConnection(client: Socket) {
    const { role, userId } = client.handshake.query;

    if (role && userId) {
      await this.handleJoin(client, role as string, parseInt(userId as string));
    } else {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    // Optional: Handle cleanup
  }

  async handleJoin(client: Socket, userType: string, userId: number) {
    if (userType === 'subscriber') {
      const subscriber = await this.subscriberService.getSubscriberById(userId);
      if (subscriber) {
        client.join(`subscriber-${userId}`);
        client.emit('welcome', { message: `Welcome, ${subscriber.username}` });
      } else {
        client.disconnect();
      }
    } else if (userType === 'client') {
      const clientUser = await this.clientService.getClientById(userId);
      if (clientUser) {
        client.join(`client-${userId}`);
        client.emit('welcome', { message: `Welcome, ${clientUser.username}` });
      } else {
        client.disconnect();
      }
    } else {
      client.disconnect();
    }
  }

  @SubscribeMessage('chat-message')
  async handleMessage(@MessageBody() message: Message, @ConnectedSocket() client: Socket) {
    const recipientRoom = message.recipientType === 'subscriber'
      ? `subscriber-${message.recipientId}`
      : `client-${message.recipientId}`;

    this.server.to(recipientRoom).emit('chat-message', message);
  }
}
