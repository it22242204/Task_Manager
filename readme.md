# Task Manager – Full-Stack CRUD App

A **modern, type-safe task management application** with user assignment, task filtering, and safe user deletion.

---

## Features

| Feature | Status |
|-------|--------|
| Create, Edit, Delete Tasks | Done |
| Assign Tasks to Users | Done |
| Toggle Task Completion | Done |
| Filter Tasks (All / Active / Completed) | Done |
| Full User Management | Done |
| Safe User Deletion (`onDelete: SetNull`) | Done |
| TypeScript + React + MUI | Done |
| REST API with Express + Prisma | Done |
| Error Handling & Validation | Done |

---

## Tech Stack

| Layer | Technology |
|------|------------|
| **Frontend** | React, TypeScript, Material UI |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | SQLite (dev) / PostgreSQL (prod-ready) |
| **API** | RESTful JSON |
| **Styling** | MUI Components + Icons |

---

## Project Structure

```
Task_Manager/
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/     # TaskList, TaskForm, etc.
│   │   ├── pages/          # TasksPage, UsersPage
│   │   ├── services/       # API calls
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx
│   └── package.json
│
├── backend/                # Express + Prisma
│   ├── prisma/
│   │   └── schema.prisma   # DB model
│   ├── controllers/        # Business logic
│   ├── routes/             # API endpoints
│   └── server.ts
│
└── README.md
```

---

## Database Schema (Prisma)

```prisma
model User {
  id           Int      @id @default(autoincrement())
  name         String
  email        String   @unique
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  assignedTasks Task[]   @relation("AssignedTasks")
  createdTasks  Task[]   @relation("CreatedTasks")
}

model Task {
  id           Int      @id @default(autoincrement())
  title        String
  description  String
  completed    Boolean  @default(false)

  assigneeId   Int?
  assignee     User?    @relation("AssignedTasks", fields: [assigneeId], references: [id], onDelete: SetNull)

  creatorId    Int?
  creator      User?    @relation("CreatedTasks", fields: [creatorId], references: [id], onDelete: SetNull)

  dueDate      DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([assigneeId])
  @@index([creatorId])
}
```

> **Safe Delete**: Users can be deleted — tasks remain with `creatorId`/`assigneeId` set to `NULL`.

---

## API Endpoints

### Tasks (`/api/tasks`)
| Method | Route | Description |
|-------|-------|-----------|
| `GET` | `/tasks` | Get all tasks |
| `POST` | `/tasks` | Create task |
| `PUT` | `/tasks/:id` | Update task |
| `DELETE` | `/tasks/:id` | Delete task |

### Users (`/api/users`)
| Method | Route | Description |
|-------|-------|-----------|
| `GET` | `/users` | Get all users |
| `POST` | `/users` | Create user |
| `PUT` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Delete user |

---

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/it22242204/Task_Manager.git
cd Task_Manager
```

### 2. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

> Runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

> Runs on `http://localhost:3000`

---

## Key Implementation Notes

- `creatorId` is **hardcoded to `1`** (first user) for demo
- Use `users[0]?.id` in production
- All API calls use **raw `response.data`**, no `ApiResponse<T>` wrapper
- Task toggle uses `PUT /tasks/:id` with `{ completed: true }`
- User deletion **preserves tasks**

---

## TypeScript Types

```ts
// types/index.ts
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  assigneeId?: number | null;
  creatorId?: number | null;
  dueDate?: string | null;
}

export interface TaskFormData {
  title: string;
  description: string;
  assigneeId?: number | null;
}

export interface UpdateTaskData extends TaskFormData {
  completed?: boolean;
}
```


## Future Enhancements

- [ ] User Authentication (JWT)
- [ ] Due Date Picker
- [ ] Task Priority
- [ ] Email Notifications
- [ ] Search & Filter
- [ ] Export to CSV
- [ ] Soft Delete

---


**Task Manager – Simple. Powerful. Done.**