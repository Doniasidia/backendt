import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { Messages } from './messages.entity';
import { ChatService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private chatService: ChatService) { }

  @WebSocketServer()
  server: Server;

  public afterInit(): void {
    return console.log(`Init ${MessagesGateway.name}`);
  }

  async handleDisconnect(client: Socket) {
    return console.log(`Client: ${client.id} disconnected`);
  }

  public handleConnection(@ConnectedSocket() client: Socket): void {
    return console.log(`Client: ${client.id} connected`);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, roomId: number) {
    console.log(`Client ${client.id} joined room: ${roomId}`);
    client.join(roomId.toString());
    return roomId;
  }

  @SubscribeMessage('leave')
  handleLeave(client: Socket, roomId: number) {
    console.log(`Client ${client.id} leaved room: ${roomId}`);
    client.leave(roomId.toString());
    return roomId;
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() payload: Messages, client: Socket) {
    console.log(
      `Client ${client?.id} sended message: ${payload} to room: `,
    );
    await this.chatService.createMessage(payload);
    this.server.emit('recMessage', payload);
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(
    @ConnectedSocket() socket: Socket,
  ) {
    const messages = await this.chatService.getMessages();
    socket.emit('send_all_messages', messages);
  }
}
