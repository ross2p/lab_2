import { Module } from '@nestjs/common';
import { HeadCommand } from './commands/head.command';

@Module({
  providers: [HeadCommand],
})
export class HeadModule {}
