import { Injectable } from '@nestjs/common';
import { Chat } from '../../../typings/types';
import { createUUID } from '../utils/utils';

@Injectable()
export class ChatService {
  chats: Chat[] = [
    {
      id: 'AAA',
      title: 'testChat',
      lastMessage: {
        id: 'eee',
        text: 'rwerwdsf',
      },
    },
    {
      id: 'AAA1',
      title: 'testChat133',
      lastMessage: {
        id: 'eee',
        text: 'rwerwdsf',
      },
    },
    {
      id: 'AAA2',
      title: 'testChat2',
      lastMessage: {
        id: 'eee',
        text: 'rwerwdsf',
      },
    },
  ];

  getAll(): Chat[] {
    return this.chats;
  }

  createChat(title: string): Chat {
    const chat = {
      id: createUUID(),
      title,
      lastMessage: {
          id: createUUID(),
          text: `Chat ${title} created`,
        },
    };
    this.chats.push(chat);
    return chat;
  }
}
