import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from './messages.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Messages) private chatRepository: Repository<Messages>,
    ) { }
    async createMessage(chat: Messages): Promise<Messages> {
        return await this.chatRepository.save(chat);
    }

    async getMessages(): Promise<Messages[]> {
        return await this.chatRepository.find();
    }
}