# CMS de Noticias CANACO

Foundation for the CANACO SERVYTUR Villahermosa institutional news CMS. It uses Django 5.2.17,
PostgreSQL only, environment-specific settings, WhiteNoise, and a compiled Tailwind CSS 4.3 asset.

## Prerequisites

- Python 3.13.15 and `uv` 0.12.17 or newer within the 0.12 release line.
- PostgreSQL 17.11.
- Node.js and npm for the CSS build only.

## Local setup

1. Create the local PostgreSQL role and database:

   ```bash
   createuser canaco_news --pwprompt
   createdb canaco_news --owner=canaco_news --encoding=UTF8
   ```

2. Create the local environment file and set a real secret:

   ```bash
   cp .env.example .env
   ```

3. Install the locked Python and Node dependencies, then compile static CSS:

   ```bash
   uv sync --locked
   npm ci
   npm run build:css
   ```

4. Apply migrations and run the development server:

   ```bash
   uv run python manage.py migrate
   uv run python manage.py runserver
   ```

   `core.0001_enable_unaccent` creates PostgreSQL's `unaccent` extension. If the application role
   lacks `CREATE EXTENSION`, a PostgreSQL superuser must first run
   `CREATE EXTENSION IF NOT EXISTS unaccent;` in the application database.

## Settings

Set `DJANGO_SETTINGS_MODULE` explicitly. `.env.example` defaults to development.

- `config.settings.development` enables local debugging and accepts localhost.
- `config.settings.test` uses PostgreSQL settings with a fast password hasher.
- `config.settings.production` enables HTTPS, secure cookies, HSTS, and WhiteNoise's compressed
  manifest storage.

SQLite is not supported in any environment. `.env`, `media/`, and `staticfiles/` are ignored by
Git; `static/css/tailwind.css` is a versioned build artifact required before `collectstatic`.

## Validation

After preparing `.env` and PostgreSQL, run:

```bash
uv run python manage.py check
uv run pytest
uv run ruff check .
uv run ruff format --check .
npm run build:css
uv run python manage.py collectstatic --noinput
```

The base templates load only the compiled `static/css/tailwind.css`; no Tailwind CDN or browser
runtime is used. `MEDIA_ROOT` is the local `media/` directory in development.
