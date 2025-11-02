#!/usr/bin/env node
import { CommandFactory } from 'nest-commander';
import { UniqModule } from './uniq.module';

async function bootstrap() {
  await CommandFactory.run(UniqModule, ['warn', 'error']);
}

void bootstrap();
