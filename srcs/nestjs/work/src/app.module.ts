import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatsModule } from './khrov-chat/chats/chats.module';
import { ChannelsModule } from './khrov-chat/channels/channels.module';

@Module({
	imports: [  
              ServeStaticModule.forRoot({
                rootPath: join(__dirname, '../..', 'client/dist'), 
              }), 
              ChatsModule,
              ChannelsModule,
			      ],
})
export class AppModule {}
