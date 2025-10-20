# Налаштування деплою на NPM

## Що робить GitHub Actions

GitHub Actions автоматично деплоїть пакет на NPM при push-і на гілку `main`:

1. **Запускає тести** - unit тести та e2e тести
2. **Будує проект** - компілює TypeScript в JavaScript
3. **Тестує команди** - перевіряє роботу `head` та `uniq`
4. **Публікує на NPM** - заливає пакет в npm registry
5. **Створює Release** - генерує GitHub Release

## Налаштування

### 1. Отримати NPM Token

1. Зареєструйтеся на [npmjs.com](https://www.npmjs.com)
2. Перейдіть на сторінку [Access Tokens](https://www.npmjs.com/settings/~/tokens)
3. Створіть новий **Granular Access Token** з правами:
   - Packages: Read and write
   - Organizations: Read

### 2. Додати Secret в GitHub

1. Перейдіть в репозиторій
2. Settings → Secrets and variables → Actions
3. Натисніть "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Вставте ваш NPM token
6. Натисніть "Add secret"

### 3. Налаштування package.json

package.json вже налаштований:

- `name`: `@rostyslavpasternak/lab-2` - скопійований пакет
- `private`: `false` - можна публікувати
- `access`: `public` - буде доступен усім

**Важливо:** Змініть username в имені пакету на ваш!

```json
{
  "name": "@ВАШ_USERNAME/lab-2",
  "version": "0.0.1",
  ...
}
```

### 4. Версіонування

Для оновлення версії:

```bash
npm version patch   # 0.0.1 → 0.0.2
npm version minor   # 0.0.1 → 0.1.0
npm version major   # 0.0.1 → 1.0.0
git push --tags
```

## Workflow процес

```
1. Push на main/develop
   ↓
2. Запускаються тести (Node 18.x, 20.x)
   ↓
3. Будування проекту
   ↓
4. Тестування команд
   ↓
5. Якщо це main - ДЕПЛОЙ НА NPM
   ↓
6. Створення GitHub Release
```

## Команда для локального деплою (необхідно)

Якщо ви хочете спробувати локально:

```bash
# Переконайтеся, що ви залогінені
npm login

# Оновіть версію
npm version patch

# Опублікуйте
npm publish --access public
```

## Перевірка

Після деплою перевірте пакет:

```bash
npm view @rostyslavpasternak/lab-2
```

## Встановлення пакету

Коли пакет опублікований, його можна встановити:

```bash
npm install -g @rostyslavpasternak/lab-2

# Тепер доступні команди
lab-2 head <file> -n 10
lab-2 uniq <file> -c
```

## Вирішення проблем

### Помилка: "You do not have permission to publish"

- Переконайтеся, що ви власник пакету
- Або змініть имя пакету на свій username

### Помилка: "npm ERR! 404 Not Found"

- Пакет ще не існує, це нормально для першої публікації

### Помилка: "ERR! You must be logged in"

- Переконайтеся, що `NPM_TOKEN` правильно встановлений в Secrets
- Перевірте, що token не скінчився

## GitHub Actions Secrets

Доступні секрети в workflow:

- `NPM_TOKEN` - ваш npm token
- `GITHUB_TOKEN` - автоматично створюється GitHub для Release
