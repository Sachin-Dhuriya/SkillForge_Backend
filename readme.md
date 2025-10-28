# 🧠 SkillForge Backend API

A backend for an online learning platform built using **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**.  
It supports **user authentication**, **instructor-based course management**, and **secure CRUD operations**.

---

## ⚙️ Tech Stack

- **Node.js** + **Express.js** – Server framework  
- **Prisma ORM** – Database ORM for PostgreSQL  
- **PostgreSQL** – Relational database  
- **JWT** – Authentication  
- **bcrypt** – Password hashing  
- **Morgan & Helmet** – Logging & security middleware  

---

## 📂 Project Structure

SkillForge_Backend/
│
├── prisma/
│ └── schema.prisma
│
├── src/
│ ├── controllers/
│ │ ├── authController.js
│ │ └── courseController.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ └── courseRoutes.js
│ └── middlewares/
│ └── authMiddleware.js
│
├── .env
├── package.json
└── server.js


---

## 🔐 Authentication Routes (User Module)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/auth/register` | Register a new user (student/instructor) |
| `POST` | `/api/auth/login` | Login user and return JWT token |
| `GET` | `/api/auth/profile` | Get logged-in user profile (Protected) |
| `PUT` | `/api/auth/profile` | Update profile name (Protected) |
| `DELETE` | `/api/auth/profile` | Delete user account (Protected) |
| `POST` | `/api/auth/logout` | Logout user (invalidate token on frontend) |

---

## 📚 Course Routes (Instructor Module)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/course/add` | Instructor adds a new course |
| `GET` | `/api/course/all` | Fetch all available courses (Public) |
| `GET` | `/api/course/:id` | Get specific course by ID (Public) |
| `PUT` | `/api/course/:id` | Instructor updates their own course |
| `DELETE` | `/api/course/:id` | Instructor deletes their own course |

---

## 🧩 Relations (Prisma Schema)

- One **Instructor (User)** → Many **Courses**  
- Each **Course** belongs to one **Instructor**

**Schema Example:**

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      String   @default("student")
  createdAt DateTime @default(now())
  courses   Course[] @relation("InstructorCourses")
}

model Course {
  id           Int      @id @default(autoincrement())
  title        String
  description  String
  price        Float
  category     String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  instructorId Int
  instructor   User     @relation("InstructorCourses", fields: [instructorId], references: [id])
}
