# The Room of Secrets — Docker Guide

Этот файл сохранён как техническая памятка по Docker Compose. Основной README проекта находится в корне репозитория.

## Основные команды Docker Compose

| Команда      | Что делает                                             |
| ------------ | ------------------------------------------------------ |
| `build`      | Только собирает образы                                 |
| `create`     | Только создаёт контейнеры без запуска                  |
| `start`      | Запускает контейнеры, которые уже были созданы ранее   |
| `run`        | Запускает одноразовый контейнер для команды            |
| `up`         | Создаёт и запускает контейнеры                         |
| `up --build` | Создаёт, запускает и принудительно пересобирает образы |

## Запуск с явным указанием env-файлов

```bash
docker compose --env-file ./frontend/.env --env-file ./backend/.env -f compose.dev.yml up --build
```

```bash
docker compose --env-file ./frontend/.env --env-file ./backend/.env -f compose.prod.yml up --build
```

`--env-file` нужен Docker Compose для подстановки переменных вроде `${BACKEND_PORT}`, `${DB_PORT}` и `${FRONTEND_PORT}` в compose-файлах.

## Остановка сервисов

```bash
docker compose --env-file ./frontend/.env --env-file ./backend/.env -f compose.dev.yml down
```

Полная очистка контейнеров и данных:

```bash
docker compose --env-file ./frontend/.env --env-file ./backend/.env -f compose.prod.yml down --volumes
```

## Просмотр переменных окружения

В уже запущенных compose-сервисах:

```bash
docker compose -f compose.dev.yml exec backend printenv
docker compose -f compose.dev.yml exec frontend printenv
```

Через Docker напрямую:

```bash
docker exec room_backend printenv
docker exec room_frontend printenv
```

`docker compose exec` выполняет команду внутри сервиса, управляемого compose-проектом. `docker exec` обращается к уже существующему контейнеру по имени или ID.

## Вход в контейнер

```bash
docker ps
docker exec -it room_backend sh
```

Полезные команды внутри контейнера:

```bash
node -v
ps aux
printenv
pwd
ls -la
```

## Redis

```bash
docker exec -it room_redis redis-cli -p 8002
```

Полезные команды:

```bash
KEYS *
GET <key>
SET <key> <value>
DEL <key>
FLUSHDB
exit
```

## PostgreSQL

```bash
docker exec -it room_postgres psql -U admin -d the_room_of_secrets -p 8001
```

Полезные команды:

```sql
\dt
SELECT * FROM users;
SELECT * FROM rooms;
SELECT * FROM messages;
\q
```
