import { Command, CommandRunner, Option } from 'nest-commander';
import * as fs from 'fs';
import * as readline from 'readline';

@Command({
  name: 'uniq',
  description: 'Remove adjacent duplicate lines from a file',
  arguments: '[file]',
})
export class UniqCommand extends CommandRunner {
  @Option({
    flags: '-c, --count',
    description: 'Display the count of repetitions for each group',
    defaultValue: false,
  })
  parseCount(): boolean {
    return true;
  }

  @Option({
    flags: '-d, --duplicates',
    description: 'Output only lines that are repeated',
    defaultValue: false,
  })
  parseDuplicates(): boolean {
    return true;
  }

  @Option({
    flags: '-u, --unique',
    description: 'Output only unique lines',
    defaultValue: false,
  })
  parseUnique(): boolean {
    return true;
  }

  async run(
    passedParam: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const filePath = passedParam[0];
    const countFlag: boolean = (options?.count as boolean) || false;
    const duplicatesFlag: boolean = (options?.duplicates as boolean) || false;
    const uniqueFlag: boolean = (options?.unique as boolean) || false;

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

      let previousLine: string | null = null;
      let count = 0;
      const results: Array<{ line: string; count: number }> = [];

      for await (const line of rl) {
        if (line === previousLine) {
          count++;
        } else {
          if (previousLine !== null) {
            results.push({ line: previousLine, count });
          }
          previousLine = line;
          count = 1;
        }
      }

      // Add the last line
      if (previousLine !== null) {
        results.push({ line: previousLine, count });
      }

      // Filter and output results
      for (const item of results) {
        if (uniqueFlag && item.count > 1) {
          continue; // Skip duplicates
        }
        if (duplicatesFlag && item.count === 1) {
          continue; // Skip unique
        }

        if (countFlag) {
          console.log(`${item.count} ${item.line}`);
        } else {
          console.log(item.line);
        }
      }
    } catch (error) {
      console.error(
        `Error reading file: ${error instanceof Error ? error.message : String(error)}`,
      );
      process.exit(1);
    }
  }
}
