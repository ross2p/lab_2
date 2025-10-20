import { Command, CommandRunner, Option } from 'nest-commander';
import * as fs from 'fs';
import * as readline from 'readline';

@Command({
  name: 'uniq',
  description: 'Видаляє сусідні дублікати рядків у файлі',
})
export class UniqCommand extends CommandRunner {
  @Option({
    flags: '-c, --count',
    description: 'Виводить кількість повторень для кожної групи',
    defaultValue: false,
  })
  parseCount(): boolean {
    return true;
  }

  @Option({
    flags: '-d, --duplicates',
    description: 'Виводить тільки рядки, які повторюються',
    defaultValue: false,
  })
  parseDuplicates(): boolean {
    return true;
  }

  @Option({
    flags: '-u, --unique',
    description: 'Виводить тільки унікальні рядки',
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
    const countFlag = options?.count || false;
    const duplicatesFlag = options?.duplicates || false;
    const uniqueFlag = options?.unique || false;

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

      // Додаємо останній рядок
      if (previousLine !== null) {
        results.push({ line: previousLine, count });
      }

      // Фільтруємо та виводимо результати
      for (const item of results) {
        if (uniqueFlag && item.count > 1) {
          continue; // Пропускаємо дублікати
        }
        if (duplicatesFlag && item.count === 1) {
          continue; // Пропускаємо унікальні
        }

        if (countFlag) {
          console.log(`${item.count} ${item.line}`);
        } else {
          console.log(item.line);
        }
      }
    } catch (error) {
      console.error(`Помилка при читанні файлу: ${error.message}`);
      process.exit(1);
    }
  }
}
