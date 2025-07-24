# Frontend Refactor Overview

This document summarizes the structure of the Vue 3 frontend and how to work with it.

## Structure

- **`src/components/`** – reusable Vue components such as tables, forms and helpers.
- **`src/views/`** – page level components mapped to routes.
- **`src/layouts/`** – layout wrappers (currently `MainLayout`) that provide the app shell.
- **`src/stores/`** – Pinia stores used for state management.
- **`src/api/`** – simple modules that call the backend via the Axios service.

## Key features

- Global state handled with **Pinia** stores.
- Service layer built on **Axios** for API requests (`src/services/axios.js`).
- Styling with **Tailwind CSS**, including dark mode and RTL support.
- Modal forms implemented with **Headless UI** dialogs.
- Pagination logic in list views (e.g. `DriverCards.vue`).
- Drafts saved to **localStorage** so forms persist between sessions.
- Toast **notifications** for success and error messages.

## Usage

Run the development server from `frontend/`:

```sh
npm install
npm run dev
```

Create a production build:

```sh
npm run build
```

All Jest tests can be run from the repository root:

```sh
npm test
```
