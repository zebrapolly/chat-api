import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolvers';

@Module({
  imports: [],
  providers: [ChatService, ChatResolver],
  exports: [ChatService],
})
export class ChatModule {}
