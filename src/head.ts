#!/usr/bin/env node
import { CommandFactory } from 'nest-commander';
import { HeadModule } from './head.module';

async function bootstrap() {
  await CommandFactory.run(HeadModule, ['warn', 'error']);
}

void bootstrap();
