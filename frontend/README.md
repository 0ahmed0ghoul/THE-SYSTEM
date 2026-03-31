<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
# 🚀 Workflow Manager PWA (Mini Jira)

**frontend :**
```bash
frontend/src/
├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   └── common/
├── features/
│   ├── auth/
│   ├── projects/
│   ├── tasks/
│   ├── board/
│   ├── comments/
│   ├── notifications/
│   └── offline/
├── hooks/
├── lib/
├── services/
├── store/
├── routes/
├── pages/
├── utils/
├── styles/
├── app/
├── main.tsx
└── vite-env.d.ts
What each part is for
components/ui/ → reusable buttons, inputs, modals, cards
components/layout/ → navbar, sidebar, app shell
features/ → business modules, each with its own logic
services/ → API calls
store/ → global state management
routes/ → route definitions and protected routes
app/ → app bootstrap, providers, config
offline/ → offline cache, sync helpers, service worker helpers
```
**backend :**
```bash
backend/src/
├── config/
├── controllers/
├── routes/
├── services/
├── repositories/
├── models/
├── middleware/
├── validators/
├── sockets/
├── jobs/
├── utils/
├── constants/
├── app.ts
└── server.ts
What each part is for
routes/ → API endpoints
controllers/ → request/response handling only
services/ → business logic
repositories/ → database queries
models/ → schema/entities if needed
middleware/ → auth, error handling, validation, rate limiting
sockets/ → Socket.io events
jobs/ → background tasks like notifications or cleanup
validators/ → request validation schemas
config/ → DB connection, env config, socket config
```
**Shared folder:**
``` bash
shared/
├── types/
├── constants/
├── schemas/
└── utils/

Use it for:

shared TypeScript types
status enums
validation schemas
constants like task status names
```

**PWA structure**
``` bash
frontend/src/features/offline/
├── cache.ts
├── sync.ts
├── network-status.ts
└── offline-banner.tsx
```

**Public**
``` bash
frontend/public/
├── manifest.webmanifest
├── icons/
└── sw.js
```

A **Progressive Web App (PWA)** for managing projects, tasks, and team collaboration — built with a modern full-stack architecture.

---

## 📌 Overview

This application allows teams to:

* Create and manage projects
* Organize tasks using a Kanban board
* Assign tasks to team members
* Collaborate in real-time
* Use the app even when offline

---

## ✨ Features

### 🧑‍💼 Project Management

* Create, update, and delete projects
* Add members to projects

### ✅ Task Management

* Create tasks and subtasks
* Assign tasks to users
* Track task status (Todo / In Progress / Done)

### 📊 Kanban Board

* Drag & drop tasks between columns
* Visual workflow management

### 🔔 Real-Time Updates

* Live task updates using WebSockets
* Instant notifications

### 📱 Progressive Web App (PWA)

* Installable on any device (mobile/desktop)
* Offline support with cached data

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Zustand / Redux Toolkit
* Service Workers (PWA)

### Backend

* Node.js + Express
* MySQL
* Socket.io

### Tools & Services

* Cloudinary (media uploads)
* Workbox (offline support)

---

## ⚙️ Installation (Development)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/workflow-manager.git
cd workflow-manager
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the backend folder:

```
PORT=5000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=workflow_db
JWT_SECRET=your_secret_key
```

---

## 📦 Deployment

* Frontend: Vercel
* Backend: Railway / Render
* Database: MySQL (Railway / PlanetScale)

---

## 📸 Screenshots

> Coming soon...

---

## 📄 License

This project is for educational and internship purposes.

---

## 👨‍💻 Authors

* You
* Your teammate

---

## 🚧 Status

Currently in development — new features coming soon.

>>>>>>> 0df939d1d29a67e3d5e79a61512d6b1906764f68
