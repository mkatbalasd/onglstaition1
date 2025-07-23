# Frontend

This directory contains the Vue 3 single page application built with Vite and
Tailwind CSS. The production build is served by the Express server from the
`/nagl/app` base path.

## Project setup

Install the project dependencies:

```sh
npm install
```

### Run a development server

Start the dev server with hot reload:

```sh
npm run dev
```

### Build for production

Create an optimized build:

```sh
npm run build
```

The generated files will be placed in `dist/` and can be accessed via the
Express backend at `/nagl/app/`.

When working from the repository root you can run the same build using:

```sh
npm run build:frontend
```

### Environment variables

The backend expects a `.env` file in the repository root. Copy `.env.example`
and provide your database credentials and desired port:

```sh
DB_HOST=localhost
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=lmbolwmy_leave
PORT=3002
VITE_BASE_PATH=/nagl/app/
```

`VITE_BASE_PATH` controls the subdirectory where the compiled assets are
served. It defaults to `/nagl/app/` which matches the Express configuration.
