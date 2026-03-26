# 🚀 Workflow Manager PWA (Mini Jira)

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

