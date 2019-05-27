import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolvers';
import { SubProvider } from 'src/pubSub/pubSub';

@Module({
  providers: [ChatService, ChatResolver, SubProvider],
  exports: [ChatService],
})
export class ChatModule {}
