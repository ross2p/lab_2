import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeadCommand } from './commands/head.command';
import { UniqCommand } from './commands/uniq.command';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, HeadCommand, UniqCommand],
})
export class AppModule {}
