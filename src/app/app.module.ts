import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppGateway, AppService],
})
export class AppModule {}
