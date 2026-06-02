# Riwiflow

**Riwiflow** is a vanilla JavaScript task management SPA (Single Page Application) featuring a Kanban board, role-based access control, dark/light theme switching, and full user & task CRUD. It runs against a local [json-server](https://github.com/typicode/json-server) REST API.

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
- 👥 Full user management table (create, edit, delete with task reassignment)
- 🛡️ Role-based access control — **admin** sees everything, **coder** sees their own tasks
- 🔔 Toast notification system for success, error, and informational feedback
- 🌗 Dark / Light theme toggle with matte Material Design 3 dark palette
- 🎨 Material Design 3-inspired UI with Tailwind CSS and CSS custom properties
- ⚡ Version-agnostic API layer with automatic fallback for `json-server` v0.x and v1.x
- 🆔 Auto-incrementing numeric user IDs
- 📧 Duplicate email validation on user creation and editing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Vanilla JavaScript (ES Modules) |
| Styling | Tailwind CSS v3 (CDN) + Material Symbols Outlined |
| Fonts | Inter (Google Fonts) |
| Backend | json-server (mock REST API) |
| Bundler | Vite 8 |
| Routing | Hash-based SPA router (`main.js`) |
| State | In-memory singleton object (`src/state.js`) |

---

## Project Structure

```
DashboardRiwiflow/
├── index.html                  # HTML entry point
├── main.js                     # Boot, hash router, Tailwind + fonts injection
├── db.json                     # json-server database (users + tasks)
├── package.json                # Vite dev dependency
│
└── src/
    ├── api.js                  # REST API: fetch wrapper, session, CRUD services
    ├── config.js               # Tailwind config injection + global CSS (light/dark)
    ├── constants.js            # Reusable CSS class-string constants
    ├── state.js                # Global in-memory state (currentUser, tasks, users)
    ├── shell.js                # Persistent layout: sidebar + top bar + page container
    ├── utils.js                # Helpers: escHtml(), initials()
    │
    ├── components/
    │   ├── kanban.js           # KanbanBoard: four-column board with drag-and-drop
    │   ├── modal.js            # ConfirmModal + showReassignModal (delete user flow)
    │   ├── sidebar.js          # Sidebar navigation with active state and theme toggle
    │   ├── taskCard.js         # TaskCard: draggable card with edit/delete actions
    │   └── toast.js            # Toast notification singleton
    │
    └── pages/
        ├── login.js            # Login page with animated background
        ├── dashboard.js        # Dashboard: loads data → renders KanbanBoard
        ├── createTask.js       # Create task form (admin only)
        ├── editTask.js         # Edit task form
        ├── users.js            # User management table with delete + reassign modal
        ├── createUser.js       # Create user form with auto-increment ID
        └── editUser.js         # Edit user form with duplicate email check
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Install json-server globally (if not already installed)
npm install -g json-server

# 3. Start the mock API (port 3000)
json-server --watch db.json --port 3000

# 4. In a separate terminal, start the Vite dev server
npm run dev
```

The app expects the API at `http://localhost:3000`. To change this, edit `BASE_URL` in `src/api.js`.

---

## Roles & Permissions

Riwiflow has two roles: **admin** and **coder**.

### Permission Matrix

| Action | Admin | Coder |
|---|:---:|:---:|
| View dashboard | ✅ | ✅ |
| View all tasks on board | ✅ | ✅ |
| Create task | ✅ | ❌ |
| Edit any task | ✅ | ❌ |
| Delete task | ✅ | ❌ |
| Drag tasks between columns | ✅ | ✅ |
| View users page | ✅ | ❌ |
| Create user | ✅ | ❌ |
| Edit user | ✅ | ❌ |
| Delete user (with task reassignment) | ✅ | ❌ |

When an admin deletes a user who has assigned tasks, a modal appears with three options:
1. **Reassign** tasks to another user
2. **Delete** all tasks belonging to that user
3. **Unassign** tasks (remove the userId, keep the tasks)

---

## Pages & Routes

| Hash Route | Page | Access |
|---|---|---|
| `#login` | Login | Public (redirects to `#dashboard` if already logged in) |
| `#dashboard` | Kanban Board | All authenticated users |
| `#create-task` | Create Task Form | Admin only |
| `#edit-task?id=:id` | Edit Task Form | Admin only |
| `#users` | User Management Table | Admin only |
| `#create-user` | Create User Form | Admin only |
| `#edit-user?id=:id` | Edit User Form | Admin only |

Unauthenticated requests are redirected to `#login`. Non-admin users attempting admin routes are redirected to `#dashboard`.

---

## Architecture Overview

### Router

`main.js` implements a hash-based SPA router. On `hashchange`, it parses the hash path and optional query parameters (e.g., `#edit-task?id=5`), checks authentication and role guards, then calls the appropriate page renderer.

### Shell

`src/shell.js` manages the persistent layout — sidebar navigation and top bar. Only the `#pageContent` container is replaced on each navigation, avoiding full re-renders of the application chrome.

### State

`src/state.js` exports a plain object holding `currentUser`, `tasks`, and `users`. Pages mutate this state directly and use local rendering with `skipFetch` optimization to avoid unnecessary API calls after CRUD operations.

### API Layer

`src/api.js` provides a version-agnostic fetch wrapper. The `getTasks()` function attempts `_expand=user` first (json-server v0.x), falls back to `_embed=user`, and finally fetches plain `/tasks` — ensuring compatibility across json-server versions without silent failures.

### Theme System

`src/config.js` injects CSS custom properties for both light and dark palettes following Material Design 3. The dark theme uses a matte black/purple scheme with no glow effects. Theme is toggled by adding/removing the `.dark` class on `<html>` and persisted in `localStorage`.

---

## Default Users

| ID | Name | Email | Password | Role |
|---|---|---|---|---|
| 1 | Admin User | admin@mail.com | 123456 | admin |
| 2 | Coder User | coder@mail.com | 123456 | coder |
| 3 | Jaime | jaime@mail.com | 123456 | admin |
| 4 | Sayder | sayder@mail.com | 123456 | coder |