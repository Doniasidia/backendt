import { Controller, Get, NotFoundException, Res } from '@nestjs/common';
import { ChatService } from './messages.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('/messages')
    async getAllMessages() {
        try {
            return await this.chatService.getMessages();
        } catch (error) {
            throw new NotFoundException("Unable to fetch messages.");
        }
    }
}