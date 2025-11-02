import { Command, CommandRunner, Option } from 'nest-commander';
import * as fs from 'fs';
import * as readline from 'readline';

@Command({
  name: 'head',
  description: 'Output the first lines of a file (default 10 lines)',
  arguments: '[file]',
})
export class HeadCommand extends CommandRunner {
  @Option({
    flags: '-n, --lines <number>',
    description: 'Number of lines to output (default: 10)',
    defaultValue: 10,
  })
  parseLines(val: string): number {
    return parseInt(val, 10);
  }

  async run(
    passedParam: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const filePath = passedParam[0];
    const lines: number = (options?.['lines'] as number) || 10;

    if (!filePath) {
      console.error('Error: specify the path to the file');
      process.exit(1);
    }

    if (!fs.existsSync(filePath)) {
      console.error(`Error: file '${filePath}' not found`);
      process.exit(1);
    }

    try {
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      let lineCount = 0;
      for await (const line of rl) {
        if (lineCount >= lines) {
          rl.close();
          break;
        }
        console.log(line);
        lineCount++;
      }
    } catch (error) {
      console.error(
        `Error reading file: ${error instanceof Error ? error.message : String(error)}`,
      );
      process.exit(1);
    }
  }
}
