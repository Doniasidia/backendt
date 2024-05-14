/*import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Message } from './mesage.interface';
import { UserService } from '@user/user.service';
import { SubscriberService } from '@client/subscribers/subscribers.service';

@Injectable()
export class ChatGateway {
  constructor(public readonly server: Server, private readonly subscriberService: SubscriberService) {}

  async handleJoin(client: Socket, subscriberId: number) {
    // Validate subscriber ID and retrieve user data (if applicable)
    const subscriber = await this.subscriberService.getSubscriberById(subscriberId);
    if (!subscriber) {
      console.error(`Invalid subscriber ID: ${subscriberId}`);
      return;
    }

    // Join client to a room specific to the subscriber
    client.join(`subscriber-${subscriberId}`);

    // Optionally, send a welcome message or retrieve historical messages
    // for the subscriber upon joining the room
    client.emit('welcome', { message: `Welcome to the chat, ${subscriber.username}` });
    // Or fetch and emit historical messages using a separate event
  }

  async handleMessage(client: Socket, message: Message) {
    // ... (existing validation and user data retrieval logic)
  
    const formattedMessage: Message & { senderName: string } = {
      ...message,
      senderName,
    };
  
    // Broadcast message to the recipient's room and the sender's room (optional for self-messaging)
    client.to(`subscriber-${message.recipientId}`).emit('chat-message', formattedMessage);
    client.to(`subscriber-${message.senderId}`).emit('chat-message', formattedMessage); // Optional for self-messaging
  }

  private sanitizeMessageContent(content: string): string {
    // Implement logic to sanitize message content using appropriate libraries
    // (e.g., DOMPurify, sanitize-html)
    return content; // Replace with actual sanitization logic
  }
} */
