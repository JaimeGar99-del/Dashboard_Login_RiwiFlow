# Riwiflow

**Riwiflow** is a vanilla JavaScript task management SPA (Single Page Application) with a Kanban board, role-based access control, and full user management. It runs against a local [json-server](https://github.com/typicode/json-server) REST API.

## Team

| Name | 
|---|
| Jaime García |
| Sayder Carreño |

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Roles & Permissions](#roles--permissions)
- [Pages & Routes](#pages--routes)
- [Architecture Overview](#architecture-overview)
- [Default Users](#default-users)

---

## Features

- 🔐 Email + password authentication with session persistence via `localStorage`
- 📋 Kanban board with four columns: **To Do**, **In Progress**, **In Review**, **Done**
- 🖱️ Drag-and-drop task movement between columns
- 👥 Full user management table (create, edit, delete)
- 🛡️ Role-based access control (RBAC) — single source of truth in `permissions.js`
- 🔔 Toast notification system
- 🎨 Material Design 3-inspired UI with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Vanilla JavaScript (ES Modules) |
| Styling | Tailwind CSS v3 (CDN) + Material Symbols |
| Fonts | Inter (Google Fonts) |
| Backend | json-server (mock REST API) |
| Routing | Custom hash-free SPA router |
| State | In-memory pub/sub store with cache invalidation |

---

## Project Structure

```
riwiflow/
├── index.html              # Entry point
├── main.js                 # Boot, route registration, Tailwind config
├── db.json                 # json-server database
│
└── src/
    ├── credentials.js      # API base URL, fetch wrapper, auth store, service functions
    ├── permissions.js      # RBAC — single source of truth for all access rules
    ├── router.js           # SPA router with regex params and role guards
    ├── store.js            # Pub/sub cache for tasks and users
    ├── components.js       # Shared UI: Toast, TaskCard, KanbanBoard, Sidebar
    │
    └── pages/
        ├── _shell.js       # Persistent layout (sidebar + topbar); page content swaps
        ├── login.js        # Login page
        ├── dashboard.js    # Kanban board
        ├── createTask.js   # New task form
        ├── editTask.js     # Edit task form
        ├── users.js        # User management table
        ├── createUser.js   # New user form
        └── editUser.js     # Edit user form
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# 1. Install json-server
npm install -g json-server

# 2. Start the mock API (port 3000)
json-server --watch db.json --port 3000

# 3. Serve the frontend (any static server, e.g. Vite or serve)
npx serve .
# or
npx vite
```

The app expects the API at `http://localhost:3000`. To change this, edit `BASE_URL` in `src/credentials.js`.

---

## Roles & Permissions

Riwiflow has three roles arranged in a hierarchy: **admin > modder > coder**.

All permission logic lives in `src/permissions.js` via the `can(user, action, resource)` function.

### Permission Matrix

| Action | Admin | Modder | Coder |
|---|:---:|:---:|:---:|
| View dashboard | ✅ | ✅ | ✅ |
| Create task | ✅ | ✅ | ❌ |
| Edit any task | ✅ | ✅ ¹ | ❌ |
| Edit own task | ✅ | ✅ | ✅ |
| Delete task | ✅ | ✅ ¹ | ❌ |
| Drag tasks | ✅ | ✅ ¹ | Own only |
| View users page | ✅ | ✅ | ❌ |
| Create user | ✅ | ✅ ² | ❌ |
| Edit user | ✅ | ✅ ¹ | ❌ |
| Delete user | ✅ ³ | ✅ ¹ ³ | ❌ |
| Change user role | ✅ | ✅ ¹ ⁴ | ❌ |

> ¹ Cannot act on **admin** accounts or tasks assigned to admins.  
> ² Modders can only create users with the **coder** role.  
> ³ Cannot delete their own account.  
> ⁴ Modders can only assign **coder** or **modder** roles; the **admin** option is hidden.

---

## Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | Login | Public (redirects to `/dashboard` if logged in) |
| `/dashboard` | Kanban Board | All authenticated users |
| `/create-task` | Create Task Form | Admin, Modder |
| `/edit-task/:id` | Edit Task Form | Checked inside handler via `can()` |
| `/users` | User Management Table | Admin, Modder |
| `/create-user` | Create User Form | Admin, Modder |
| `/edit-user/:id` | Edit User Form | Checked inside handler via `can()` |

Routes without an explicit role list perform fine-grained permission checks inside their page handler and redirect to `/dashboard` on failure.

---

## Architecture Overview

### Router

`src/router.js` implements a lightweight client-side router. Routes are registered with `addRoute(path, handler, { roles? })`. Dynamic segments like `/edit-task/:id` are converted to named-capture regexes. On navigation, the router runs the role guard first, then extracts params and calls the handler.

### Shell

`src/pages/_shell.js` manages the persistent layout (sidebar + top bar). Only the `#pageContent` div is swapped on each navigation, avoiding full re-renders of the chrome.

### Store

`src/store.js` is a simple pub/sub in-memory cache. It prevents duplicate API calls across pages and lets components subscribe to `tasks:changed` / `users:changed` events to re-render reactively. Call `invalidateTasks()` or `invalidateUsers()` after any mutation to bust the cache.

### Permissions

`src/permissions.js` exports a single `can(currentUser, action, resource)` function. Resources are either plain strings (`'task'`, `'user'`, `'users'`) for page-level guards or objects (`{ userId, assignedRole }` for tasks, `{ id, role }` for users) for entity-level checks.

---

## Default Users

| Name | Email | Password | Role |
|---|---|---|---|
| Admin User | admin@mail.com | 123456 | admin |
| Coder User | coder@mail.com | 123456 | coder |
| Jaime | jaime@mail.com | 123456 | modder |