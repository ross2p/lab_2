import { Command, CommandRunner, Option } from 'nest-commander';
import * as fs from 'fs';
import * as readline from 'readline';

@Command({
  name: 'head',
  description: 'Виводить перші рядки файлу (за замовчуванням 10 рядків)',
})
export class HeadCommand extends CommandRunner {
  @Option({
    flags: '-n, --lines <number>',
    description: 'Кількість рядків для виведення (за замовчуванням: 10)',
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
    const lines = options?.lines || 10;

    if (!filePath) {
      console.error('Помилка: укажіть шлях до файлу');
      process.exit(1);
    }

    if (!fs.existsSync(filePath)) {
      console.error(`Помилка: файл '${filePath}' не знайдено`);
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
      console.error(`Помилка при читанні файлу: ${error.message}`);
      process.exit(1);
    }
  }
}
