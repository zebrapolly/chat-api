import { Mutation, Query, Resolver, Args, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { PubSub } from 'graphql-subscriptions';
import {ChatsUpdateType, MessageInput, MessagesSubscription} from '../../../typings/types';
import { Inject } from '@nestjs/common';

@Resolver('Chat')
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    @Inject('PUB_SUB')private readonly subProvider: PubSub
    ) {}

  @Query('getChats')
  async getChats() {
    const chats = await this.chatService.getAll();
    return chats;
  }

  @Query('getChat')
  async getChat(@Args('id') id: string) {
    const chat = await this.chatService.findChatById(id);
    return chat;
  }

  @Mutation('createChat')
  async createChat(@Args('title') title: string) {
    const chat = this.chatService.createChat(title);
    this.subProvider.publish(
      'chatsUpdated',
      {
        chatsUpdated: {
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
    this.subProvider.publish(
      'chatsUpdated',
      {
        chatsUpdated: {
          chat,
          type: ChatsUpdateType.UPDATED,
        },
      },
    );
    this.subProvider.publish(
      'messagesUpdated',
      {
        messagesUpdated: {
          chatId: chat.id,
          message,
          type: ChatsUpdateType.CREATED,
        },
      },
    );
    return message;
  }

  @Mutation('deleteChat')
  async deleteChat(@Args('id') id: string) {
    const deletedChat = this.chatService.deleteChat(id);
    this.subProvider.publish(
      'chatsUpdated',
      {
        chatsUpdated: {
          chat: deletedChat,
          type: ChatsUpdateType.DELETED,
        },
      },
    );
    return deletedChat;
  }

  @Subscription('chatsUpdated')
  chatsUpdated() {
    return this.subProvider.asyncIterator(['chatsUpdated']);
  }

  @Subscription('messagesUpdated', {
    filter: (payload: any, variables: any) => payload.messagesUpdated.chatId === variables.id,

  })
  chatUpdated(@Args('id') id: string) {
    console.log('Subscription!!!!!!', id, this.subProvider);
    return this.subProvider.asyncIterator(['messagesUpdated']);
  }
}
