import { Mutation, Query, Resolver, Args, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { PubSub } from 'graphql-subscriptions';
import {ChatsUpdateType, MessageInput} from '../../../typings/types';
const pubSub = new PubSub();
@Resolver('Chat')
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query('getChats')
  async getChats() {
    const chats = await this.chatService.getAll();
    return chats;
  }

  @Mutation('createChat')
  async createChat(@Args('title') title: string) {
    const chat = this.chatService.createChat(title);
    pubSub.publish(
      'chatUpdated',
      {
        chatUpdated: {
          chat,
          type: ChatsUpdateType.CREATED,
        },
      },
    );
    return chat;
  }

  @Mutation('createMessage')
  async createMessage(@Args('messageInput') messageInput: MessageInput) {
    const message = this.chatService.createMessage(messageInput);
    const chat = this.chatService.findChatById(messageInput.chatId);
    pubSub.publish(
      'chatUpdated',
      {
        chatUpdated: {
          chat,
          type: ChatsUpdateType.UPDATED,
        },
      },
    );
    return message;
  }

  @Mutation('deleteChat')
  async deleteChat(@Args('id') id: string) {
    const deletedChat = this.chatService.deleteChat(id);
    pubSub.publish(
      'chatUpdated',
      {
        chatUpdated: {
          chat: deletedChat,
          type: ChatsUpdateType.DELETED,
        },
      },
    );
    return deletedChat;
  }

  @Subscription('chatUpdated')
  chatUpdated() {
    return pubSub.asyncIterator(['chatUpdated']);
  }
}
