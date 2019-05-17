import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Chat, Message, MessageInput } from '../../../typings/types';
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
      messages: [],
    },
    {
      id: 'AAA1',
      title: 'testChat133',
      lastMessage: {
        id: 'eee',
        text: 'rwerwdsf',
      },
      messages: [],
    },
    {
      id: 'AAA2',
      title: 'testChat2',
      lastMessage: {
        id: 'eee',
        text: 'rwerwdsf',
      },
      messages: [],
    },
  ];

  createMessage({chatId, authorId, text}: MessageInput): Message {
    const chat = this.findChatById(chatId);
    const message: Message = {
      id: createUUID(),
      author: {
        id: authorId,
        nick: 'mock',
      },
      timestamp: new Date().toISOString(),
      text,
    };
    chat.messages.push(message);
    chat.lastMessage = message;
    return message;
  }

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
      messages: [],
    };
    this.chats.push(chat);
    return chat;
  }

  deleteChat(id: string): Chat {
    const chat = (this.chats.find((item, index) => {
      if (item.id === id) {
        this.chats.splice(index, 1);
        return true;
      }
      return false;
      })
    );
    if (chat) {
      return chat;
    } else {
      throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);
    }
  }

  findChatById(id: string): Chat {
    const chat = this.chats.find(item => (item.id === id));
    if (chat) {
      return chat;
    } else {
      throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);
    }
  }
}
