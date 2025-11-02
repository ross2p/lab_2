import { Module } from '@nestjs/common';
import { HeadCommand } from './commands/head.command';
import { UniqCommand } from './commands/uniq.command';

@Module({
  imports: [],
  controllers: [],
  providers: [HeadCommand, UniqCommand],
})
export class AppModule {}
