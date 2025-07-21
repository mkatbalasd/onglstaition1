# Development Plan

This document tracks progress on migrating the driver card management interfaces to Vue.js. The goal is to keep the existing Express backend while replacing the views with a modern SPA built with Vue 3 and Tailwind CSS.

## Completed tasks

- Initialized a Vue 3 project using Vite inside the `frontend/` folder.
- Added Tailwind CSS with dark mode and custom font configuration.
- Configured Vite with `base: '/nagl/app/'` so assets resolve from the subfolder.
- Set up Express to serve the compiled Vue app from `/nagl/app` with a catch‑all route.
- Added basic example components and build scripts.

## Remaining tasks

- ~~Convert each EJS view under `views/` into Vue components and pages.~~ ✅
- ~~Introduce Vue Router and create routes that mirror the existing server pages.~~ ✅
- Create reusable UI components (`<Sidebar />`, `<Header />`, `<Card />`, etc.) following the minimal gray/blue theme.
- Implement RTL support and dark mode styling in all components.
- Replace jQuery or Bootstrap usage with Vue and Headless UI or Shadcn/UI components.
- Connect pages to the existing API endpoints for data fetch and submission.
- Add skeleton loading states while fetching data.
- Optimize performance with lazy loading and minimal bundle size.
- Update documentation and examples as features are completed.

This checklist will help track progress as the frontend is migrated to Vue.
