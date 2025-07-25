# frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

The dev server proxies API requests under `/api` to the backend. Create
`.env.development` with the following value so Axios points to the same path:

```bash
VITE_API_BASE=/api
```

Start the backend separately (e.g. `npm run dev` inside the `backend` directory)
and ensure it listens on `http://localhost:3002`.

### Compile and Minify for Production

```sh
npm run build
```

### Build for Deployment

By default the built files expect the API to be served under `/api`. If your backend
is hosted elsewhere, set `VITE_API_BASE` accordingly during the build:

```bash
VITE_API_BASE=/api npm run build
```
