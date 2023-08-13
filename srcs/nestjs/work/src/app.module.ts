import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { staticConfig } from '../client/static.config';
import { ChatConnectionsModule } from './khrov-chat/chat-connections/chat-connections.module';
// import { PrismaModule } from '@prisma-utils/nestjs-prisma';
import { ChatHistoryModule } from './khrov-chat/chat-history/chat-history.module';
import { ChatBlockingModule } from './khrov-chat/chat_blocking/chat-blocking.module';
import { SearchUsersModule } from './khrov-chat/search-users/search-users.module';

@Module({
	imports: [  
              ServeStaticModule.forRoot({
                rootPath: join(__dirname, '../..', 'client/dist'), 
              }), 
              ChatConnectionsModule, 
              ChatHistoryModule, 
              ChatBlockingModule, 
              SearchUsersModule
			      ],
})
export class AppModule {}
