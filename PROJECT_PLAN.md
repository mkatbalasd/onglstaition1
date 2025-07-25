# Project Plan

## Project Overview and Goals

- Develop a management dashboard for cards, drivers, vehicles, and facilities.
- Provide an easy interface to track driver cards and workflows.
- Centralize the administration of vehicles and facilities.

## Required Technologies

- Node.js with Express for backend services.
- Vue 3 for the frontend framework.
- Tailwind CSS and Headless UI for styling and components.
- MySQL as the relational database.

## Major Phases

### 1. Environment Setup and Repository Initialization
- [ ] Initialize git repository and project structure.
- [ ] Setup directories (`backend/`, `frontend/`, `database/`).
- [ ] Initialize Node.js project (`npm init`).
- [ ] Build basic Express server.
- [ ] Setup MySQL database and connection.
- [ ] Define environment variables and configuration files.

### 2. Backend API (CRUD routes per table, card-number generation logic)
- [ ] Create CRUD routes for cards table.
- [ ] Create CRUD routes for drivers table.
- [ ] Create CRUD routes for vehicles table.
- [ ] Create CRUD routes for facilities table.
- [ ] Implement card-number generation logic.

### 3. Frontend Scaffolding with Vue Router, Pinia, Axios service layer
- [ ] Scaffold Vue 3 project with Vue Router.
- [ ] Install TailwindCSS and configure.
- [ ] Install Headless UI.
- [ ] Configure Pinia for state management.
- [ ] Implement Axios-based service layer for API communication.

### 4. UI/UX Design using TailwindCSS with RTL support
- [ ] Integrate Tailwind CSS into Vue project.
- [ ] Configure RTL (right-to-left) support.
- [ ] Use Headless UI components for accessibility.
- [ ] Develop navbar component with RTL support.
- [ ] Build data tables with sorting and pagination.
- [ ] Create modal dialogs using Headless UI.

### 5. Feature Implementations
- [ ] Driver management and profile pages.
- [ ] Implement driver card workflow (facility check → driver check → card creation).
- [ ] Vehicle management pages.
- [ ] Facilities management pages.
- [ ] General card management interface.
- [ ] Advanced search, filtering, and pagination.

### 6. Global Settings and Supporting Tables
- [ ] Manage brands, models, and colors.
- [ ] Manage license types and suppliers.
- [ ] Create global settings pages for:
  - [ ] Brands
  - [ ] Models
  - [ ] Colors
  - [ ] License types
  - [ ] Suppliers
- [ ] Create utilities for global settings management.

### 7. Testing and Deployment
- [ ] Write unit and integration tests.
- [ ] Perform end-to-end testing.
- [ ] Add project documentation.
- [ ] Configure CI/CD pipeline for deployment.
- [ ] Prepare deployment steps.

## Task Tracking

Update each task checkbox to `[x]` once completed to keep the plan current.
