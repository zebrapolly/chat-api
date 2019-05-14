import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatService } from './chat.service';

@Resolver('Chat')
export class ChatResolver {
    constructor(private readonly chatService: ChatService) {}

    @Query('getChats')
    async getChats() {
        const chats = await this.chatService.getAll();
        return chats;
    }

    @Mutation('createChat')
    async createChat(title: string) {
        return this.chatService.createChat(title);
    }
}