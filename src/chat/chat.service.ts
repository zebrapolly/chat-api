import { Injectable } from '@nestjs/common';
import { Chat } from 'src/types';
import {createUUID} from '../utils/utils';

@Injectable()
export class ChatService {
  chats: Chat[] = [{
    id: 'AAA',
    title: 'testChat',
    messages: []
  }]

  getAll(): Chat[] {
    return this.chats;
  }

  createChat(title: string): Chat {
    const chat = {
      id: createUUID(),
      title,
      messages: []
    }
    this.chats.push(chat);
    return chat;
  }
}
