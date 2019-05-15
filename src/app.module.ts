import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ChatModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/**.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/types.ts'),
      },
    }),
  ],
})
export class AppModule {}
