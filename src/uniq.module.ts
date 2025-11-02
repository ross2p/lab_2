import { Module } from '@nestjs/common';
import { UniqCommand } from './commands/uniq.command';

@Module({
  providers: [UniqCommand],
})
export class UniqModule {}
