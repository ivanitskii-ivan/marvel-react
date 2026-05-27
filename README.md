# 🦸 Marvel Information Portal

Веб-приложение для просмотра каталога героев Marvel и комиксов. 
Получает данные через Comic Vine API, с возможностью поиска и просмотра деталей героев.

## 🔗 Демо

 доступно по ссылке (https://marvel-react-4reohp1t4-ivanickii-s-projects.vercel.app/)

## 🛠 Стек

- **React 17** (классовые компоненты)
- **React Router 5** (SPA-навигация)
- **SCSS** (стили с переменными)
- **Comic Vine API** (источник данных)
- **PropTypes** (типизация пропов)
- **AbortController** (отмена запросов при размонтировании)

## ✨ Что реализовано

- 🦸 Каталог героев с пагинацией (Prev/Next)
- 🎲 Random Character — случайный герой при загрузке
- 📖 Детальная карточка героя со списком его комиксов
- 📚 Раздел комиксов с обложками и ценами
- ⏳ Skeleton-состояния пока загружаются данные
- ❌ Error Boundary для каждого критического блока
- 🐱 Кастомная страница ошибки "Capitan 404"
- 📱 Адаптивная вёрстка

## 🏗 Архитектура

- `ApiService` — отдельный класс для работы с API
- `Promise.all` для параллельных запросов (герой + его комиксы)
- `AbortController` для отмены устаревших запросов
- `ErrorBoundary` обёрнут вокруг каждого критического компонента
- Чёткое разделение состояний: `skeleton / loading / error / success`

## 🚀 Локальный запуск

\`\`\`bash
# 1. Клонировать
git clone https://github.com/ivanitskii-ivan/marvel-react.git
cd marvel-react

# 2. Установить зависимости
npm install

# 3. Создать файл .env в корне:
REACT_APP_API_KEY=ваш_ключ_от_comicvine.gamespot.com
REACT_APP_API_URL=https://comicvine.gamespot.com

# 4. Запустить
npm start
\`\`\`

## 📚 Чему научился на этом проекте

- Работа с REST API и трансформация ответов
- Жизненный цикл React-компонентов (componentDidMount, componentDidUpdate, componentWillUnmount)
- Управление состоянием в классовых компонентах
- Маршрутизация SPA через React Router
- Обработка ошибок через ErrorBoundary
- Отмена запросов через AbortController (избегаем race conditions)

---

📧 Связаться: ivanitskii.ivan06@yandex.com
