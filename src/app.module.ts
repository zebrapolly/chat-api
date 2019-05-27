import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ChatModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/**.graphql'],
      installSubscriptionHandlers: true,
    }),
  ]
})
export class AppModule {}
