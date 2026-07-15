# The Room of Secrets

**The Room of Secrets** — pet-проект полнофункционального real-time чата с комнатами, авторизацией, профилем пользователя, хранением истории сообщений и базовой observability-инфраструктурой. Проект разделён на frontend и backend, запускается через Docker Compose и демонстрирует типичный production-oriented стек для небольшого web-приложения.

## Возможности

- Регистрация, вход, выход и обновление пользовательской сессии.
- Access token для API и Socket.IO, refresh token в httpOnly cookie.
- Защищённые страницы и API-роуты для авторизованных пользователей.
- Создание комнат, вход в комнату, выход из комнаты и список комнат пользователя.
- Real-time обмен сообщениями через Socket.IO.
- Онлайн-присутствие участников комнаты: события входа и выхода пользователя.
- Профиль пользователя с изменением username, email и пароля.
- Хранение пользователей, комнат и сообщений в PostgreSQL.
- Redis для refresh token, буфера сообщений и быстрого получения свежих сообщений.
- Фоновый воркер, который периодически сбрасывает сообщения из Redis в PostgreSQL.
- Метрики Prometheus и логи через Loki/Promtail/Grafana в production-compose.

## Технологический стек

| Зона           | Технологии                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------- |
| Frontend       | React 19, TypeScript, Vite, React Router, Zustand, React Hook Form, Zod, Sass, Gravity UI, Three.js |
| Backend        | Node.js 24, TypeScript, Express 5, Socket.IO, PostgreSQL, Redis, JWT, bcrypt                        |
| Инфраструктура | Docker, Docker Compose, Nginx, Prometheus, Loki, Promtail, Grafana                                  |
| Хранилища      | PostgreSQL для основных данных, Redis для сессий и временного буфера сообщений                      |

## Архитектура

```text
frontend
  src/app       — провайдеры, роутинг, layout приложения
  src/pages     — страницы приложения
  src/widgets   — крупные UI-блоки: sidebar, chat, profile card, alerts
  src/features  — пользовательские сценарии: login, register, create room, send message
  src/entities  — модели и API сущностей: session, user, room, message
  src/shared    — общие API-клиенты, утилиты, типы, UI-компоненты

backend
  src/routes          — HTTP-маршруты Express
  src/domains         — бизнес-логика, repositories, validations, events
  src/infrastructure  — БД, Redis, Socket.IO, auth middleware, metrics, background workers
  src/shared          — logger, ошибки, общие утилиты
```

Backend построен вокруг доменных модулей: authentication, user, room и message. HTTP-слой отвечает за REST-сценарии, Socket.IO — за real-time взаимодействие внутри комнат. События домена проходят через внутренний event bus, что отделяет бизнес-действия от побочных эффектов.

## Как работает обмен сообщениями

1. Пользователь подключается к Socket.IO с access token.
2. Клиент отправляет `join_room`, сервер проверяет комнату и добавляет socket в Socket.IO-room.
3. При `send_message` сервер валидирует payload и проверяет, что socket действительно состоит в комнате.
4. Сообщение кладётся в Redis:
   - в общий batch-буфер для последующего сохранения;
   - в room-буфер для быстрого получения свежих сообщений.
5. Сервер рассылает `new_message` всем участникам комнаты.
6. Background worker каждые несколько секунд пачками сохраняет сообщения из Redis в PostgreSQL.

## Быстрый старт через Docker

### 1. Подготовить env-файлы

Скопируйте примеры переменных окружения:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Минимальный пример `backend/.env` для локального запуска:

```env
NODE_ENV=development
PORT=8000
BACKEND_PORT=8000

DB_HOST=postgres
DB_PORT=8001
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=the_room_of_secrets

REDIS_PORT=8002
REDIS_URL=redis://redis:8002

JWT_ACCESS_TOKEN_SECRET=change_me_access_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_SECRET=change_me_refresh_secret
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

CORS_ORIGINS=http://localhost:8003

LOKI_PORT=3100
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin
```

Минимальный пример `frontend/.env`:

```env
FRONTEND_PORT=8003
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
```

Важно: backend-сервер в коде слушает `PORT` или `8000` по умолчанию, а Docker Compose пробрасывает `${BACKEND_PORT}`. Если меняете порт backend, держите `PORT` и `BACKEND_PORT` согласованными.

### 2. Запустить dev-окружение

```bash
docker compose --env-file ./backend/.env --env-file ./frontend/.env -f compose.dev.yml up --build
```

После запуска:

- frontend: `http://localhost:8003`
- backend API: `http://localhost:8000/api`
- Socket.IO: `http://localhost:8000`
- PostgreSQL: `localhost:8001`
- Redis: `localhost:8002`

### 3. Остановить окружение

```bash
docker compose --env-file ./backend/.env --env-file ./frontend/.env -f compose.dev.yml down
```

Удалить контейнеры вместе с volume-данными:

```bash
docker compose --env-file ./backend/.env --env-file ./frontend/.env -f compose.dev.yml down --volumes
```

## Production-like запуск

Production-compose собирает backend в `dist`, отдаёт frontend через Nginx и дополнительно поднимает observability-стек.

```bash
docker compose --env-file ./backend/.env --env-file ./frontend/.env -f compose.prod.yml up --build
```

Сервисы:

| Сервис       | Назначение                                         |
| ------------ | -------------------------------------------------- |
| `backend`    | HTTP API, Socket.IO, миграции, background worker   |
| `frontend`   | Nginx со статической сборкой React-приложения      |
| `postgres`   | Основная реляционная база                          |
| `redis`      | Сессии и буфер сообщений                           |
| `prometheus` | Сбор метрик backend, Prometheus и Loki             |
| `loki`       | Хранилище логов                                    |
| `promtail`   | Доставка логов контейнеров и backend-файлов в Loki |
| `grafana`    | Дашборды и просмотр метрик/логов                   |

По умолчанию Grafana доступна на порту из `GRAFANA_PORT`, Prometheus — на `PROMETHEUS_PORT`, Loki — на `LOKI_PORT`.

## Локальный запуск без Docker

Для полноценного локального запуска без Docker нужны PostgreSQL и Redis с параметрами из `backend/.env`.

Backend:

```bash
cd backend
npm ci
npm run build
npm run copy:migrations
npm run start
```

Dev-режим backend:

```bash
cd backend
npm ci
npm run dev
```

Frontend:

```bash
cd frontend
npm ci
npm run dev
```

## API

Базовый URL frontend-клиента задаётся через `VITE_API_URL`, обычно `http://localhost:8000/api`.

Ответы backend приведены к общему формату:

```json
{ "success": true, "data": {} }
```

или:

```json
{ "success": false, "error": { "message": "Описание ошибки" } }
```

### Auth

| Метод  | URL              | Тело запроса                    | Назначение                                   |
| ------ | ---------------- | ------------------------------- | -------------------------------------------- |
| `POST` | `/auth/register` | `{ username, email, password }` | Регистрация пользователя                     |
| `POST` | `/auth/login`    | `{ email, password }`           | Вход пользователя                            |
| `POST` | `/auth/logout`   | refresh cookie                  | Выход и отзыв refresh token                  |
| `POST` | `/auth/refresh`  | refresh cookie                  | Обновление access token через refresh cookie |

### User

| Метод  | URL                     | Тело запроса   | Назначение           |
| ------ | ----------------------- | -------------- | -------------------- |
| `GET`  | `/user/me`              | -              | Текущий пользователь |
| `POST` | `/user/update/username` | `{ username }` | Изменение username   |
| `POST` | `/user/update/email`    | `{ email }`    | Изменение email      |
| `POST` | `/user/update/password` | `{ password }` | Изменение пароля     |

### Room

| Метод    | URL            | Тело запроса | Назначение                    |
| -------- | -------------- | ------------ | ----------------------------- |
| `POST`   | `/room/create` | `{ name }`   | Создание комнаты              |
| `DELETE` | `/room/leave`  | `{ id }`     | Выход из комнаты              |
| `GET`    | `/room/user`   | -            | Комнаты текущего пользователя |

Защищённые запросы требуют заголовок:

```http
Authorization: Bearer <access_token>
```

## Socket.IO события

Клиент подключается к `VITE_SOCKET_URL` и передаёт access token в `auth.token`.

```ts
io(SOCKET_URL, {
  auth: { token: accessToken },
  withCredentials: true,
})
```

### Client -> Server

| Событие        | Payload               | Что делает                                                             |
| -------------- | --------------------- | ---------------------------------------------------------------------- |
| `join_room`    | `{ roomId }`          | Вход в комнату, получение комнаты, истории сообщений и online user ids |
| `exit_room`    | `{ roomId }`          | Выход socket из комнаты                                                |
| `send_message` | `{ roomId, content }` | Отправка сообщения в комнату                                           |

### Server -> Client

| Событие       | Payload                 | Когда приходит                                 |
| ------------- | ----------------------- | ---------------------------------------------- |
| `new_message` | `Message`               | После успешной отправки сообщения              |
| `user_joined` | `{ userId, timestamp }` | Когда другой пользователь вошёл в комнату      |
| `user_left`   | `{ userId, timestamp }` | Когда другой пользователь вышел или отключился |

## База данных

Миграции лежат в `backend/src/infrastructure/database/migrations` и выполняются автоматически при старте backend.

Основные таблицы:

| Таблица    | Назначение                                                      |
| ---------- | --------------------------------------------------------------- |
| `users`    | Пользователи, роль, статус, список комнат                       |
| `rooms`    | Комнаты и JSONB-список участников со статусами                  |
| `messages` | История сообщений с индексами по комнате, отправителю и времени |

Подключение к PostgreSQL в Docker:

```bash
docker exec -it room_postgres psql -U admin -d the_room_of_secrets -p 8001
```

Подключение к Redis:

```bash
docker exec -it room_redis redis-cli -p 8002
```

## Наблюдаемость

Backend регистрирует Prometheus-метрику `http_requests_total` с labels `method`, `route` и `status_code`. Prometheus забирает метрики с backend по `/metrics`.

Production-compose также поднимает:

- Loki для хранения логов.
- Promtail для сбора логов Docker-контейнеров с label `app.room=true` и файлов из `backend/logs`.
- Grafana с заранее подключёнными datasource для Prometheus и Loki.

## Полезные команды

Проверить логи backend:

```bash
docker logs -f room_backend
```

Посмотреть запущенные контейнеры:

```bash
docker ps
```

Зайти внутрь backend-контейнера:

```bash
docker exec -it room_backend sh
```

Собрать frontend:

```bash
cd frontend
npm run build
```

Собрать backend:

```bash
cd backend
npm run build
```

Проверить frontend линтером:

```bash
cd frontend
npm run lint
```

## Документация

Дополнительная Docker-памятка сохранена в [docs/docker-guide.md](docs/docker-guide.md).
