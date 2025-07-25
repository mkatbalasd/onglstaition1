# OnGl Station

This repository contains a backend Express API and a Vue 3 frontend.

## Setup

1. **Import the database schema**

   Use the SQL script in `database/schema.sql` to create the MySQL tables:

   ```bash
   mysql -u <user> -p <database_name> < database/schema.sql
   ```

2. **Configure environment variables**

   - Copy `backend/.env.example` to `backend/.env` and fill in your MySQL credentials.
   - Create `frontend/.env` and set `VITE_API_BASE` to the backend base URL (e.g. `http://localhost:3000/api`).

3. **Install dependencies**

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

## Development

Run the servers in separate terminals:

```bash
cd backend
npm run dev        # start Express API
```

```bash
cd frontend
npm run dev        # start Vue dev server
```

## Folder Structure

```
backend/   - Express API
frontend/  - Vue 3 application
database/  - MySQL schema
PROJECT_PLAN.md - project task list
```

## Project Plan

Tasks are tracked in `PROJECT_PLAN.md`.
When you complete a task, change its checkbox from `[ ]` to `[x]` and commit the update.

## Running Tests

Install dependencies and run tests in each package:

### Backend
```bash
cd backend
npm install
npm test
```

### Frontend
```bash
cd frontend
npm install
npm test
```

The backend tests use **jest** and **supertest** while the frontend unit tests use **@vue/test-utils** with jest.
