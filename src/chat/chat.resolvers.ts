import { Mutation, Query, Resolver, Args, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { PubSub } from 'graphql-subscriptions';
import {ChatsUpdateType, MessageInput, MessagesSubscription} from '../../../typings/types';
const pubSub = new PubSub();

@Resolver('Chat')
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

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
    pubSub.publish(
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
    pubSub.publish(
      'chatsUpdated',
      {
        chatsUpdated: {
          chat,
          type: ChatsUpdateType.UPDATED,
        },
      },
    );
    pubSub.publish(
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
    pubSub.publish(
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
    return pubSub.asyncIterator(['chatsUpdated']);
  }

  @Subscription('messagesUpdated', {
    filter: (payload: any, variables: any) => payload.messagesUpdated.chatId === variables.id,

  })
  chatUpdated(@Args('id') id: string) {
    console.log('Subscription!!!!!!', id, pubSub);
    return pubSub.asyncIterator(['messagesUpdated']);
  }
}
