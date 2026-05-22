# DevPulse Issue Tracker API

A robust RESTful API for issue tracking and team collaboration, built with Node.js, Express.js, and TypeScript. The system features JWT-based authentication, role-based access control, and a PostgreSQL database managed via raw SQL queries.

**Live URL:** [https://issue-tracker-api-delta.vercel.app/](https://issue-tracker-api-delta.vercel.app/)

---


## 📌Overview

DevPulse Issue Tracker API provides a structured backend for managing software issues and feature requests within a development team. It supports two user roles — **contributor** and **maintainer** — each with clearly defined permissions. Contributors can create and manage their own issues, while maintainers have full administrative control over all issues and system metrics. All protected routes are secured using JSON Web Tokens (JWT).

---

## 🛠️Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| TypeScript | Type-safe development |
| Express.js | Web application framework |
| PostgreSQL | Relational database |
| Raw SQL | Database query layer |
| JWT | Stateless authentication |
| Bcrypt | Password hashing |
| NeonDB | Serverless PostgreSQL hosting |

---

## 🗄️ Database Schema Design

The system runs on two primary relational tables linked through relational application logic.

### 1. 👤`users` Table
Stores authenticated user credentials, baseline information, and access control scopes.

| Field | Data Type | Modifiers / Requirements | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY`, Auto-incrementing | Unique user account identifier. |
| `name` | `VARCHAR` | `NOT NULL` | Full display name of the team member. |
| `email` | `VARCHAR` | `UNIQUE`, `NOT NULL` | Valid login email address across all accounts. |
| `password` | `VARCHAR` | `NOT NULL` | Securely hashed string. *Never returned in responses.* |
| `role` | `VARCHAR` | `DEFAULT 'contributor'` | Must be either `'contributor'` or `'maintainer'`. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Automatic timestamp generated on registration. |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Automatic timestamp updated on entry modification. |

### 2. 🐞`issues` Table
Tracks software bugs and feature requests reported across the platform.

| Field | Data Type | Modifiers / Requirements | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY`, Auto-incrementing | Unique issue identifier. |
| `title` | `VARCHAR(150)`| `NOT NULL`, Max 150 chars | Short descriptive headline of the issue. |
| `description`| `TEXT` | `NOT NULL`, Min 20 chars | Detailed explanation or reproduction steps. |
| `type` | `VARCHAR` | `NOT NULL` | Categorization: Must be `'bug'` or `'feature_request'`. |
| `status` | `VARCHAR` | `DEFAULT 'open'` | Current workflow state: `'open'`, `'in_progress'`, `'resolved'`. |
| `reporter_id` | `INTEGER` | `NOT NULL` | References user table ID (Validated via application layers). |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Automatic timestamp generated on creation. |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Automatic timestamp updated on workflow shift. |

---

# 🔐 Authentication Flow

```text
Client Login
    ↓
Server validates credentials
    ↓
Password compare using bcrypt
    ↓
JWT token generated
    ↓
Client stores token
    ↓
Client sends Authorization token
    ↓
Server verifies JWT
    ↓
Protected route access granted
```

### 👥User Roles & Permissions

| Action | Contributor | Maintainer |
|---|:---:|:---:|
| Sign up & log in | ✅ | ✅ |
| Create issues (`bug` or `feature_request`) | ✅ | ✅ |
| View all issues | ✅ | ✅ |
| Update own issue (only if status is `open`) | ✅ | ✅ |
| Update any issue (any field) | ❌ | ✅ |
| Delete any issue | ❌ | ✅ |
| Change issue workflow status | ❌ | ✅ |
| Access internal system metrics | ❌ | ✅ |

---

## 📡API Endpoints

### Authentication Module

---

#### 1. User Signup

**Endpoint:** `POST /api/auth/signup`  
**Access:** Public

**Request Body**
```json
{
  "name": "Shahadat Hossain",
  "email": "shahadat@example.com",
  "password": "SecurePass123",
  "role": "maintainer"
}
```

> **Note:** `role` must be either `contributor` or `maintainer`. Any other value returns a `400 Bad Request`.

**Success Response — `201 Created`**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": 21,
        "name": "Shahadat Hossain",
        "email": "shahadat@example.com",
        "role": "maintainer",
        "create_at": "2026-05-22T10:45:45.764Z",
        "update_at": "2026-05-22T10:45:45.764Z"
    }
}
```


---

#### 2. User Login

**Endpoint:** `POST /api/auth/login`  
**Access:** Public

**Request Body**
```json
{
  "email": "shahadat@example.com",
  "password": "SecurePass123"
}
```

**Success Response — `200 OK`**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6I...",
        "user": {
            "id": 21,
            "name": "Shahadat Hossain",
            "email": "shahadat@example.com",
            "role": "maintainer",
            "create_at": "2026-05-22T10:45:45.764Z",
            "update_at": "2026-05-22T10:45:45.764Z"
        }
    }
}
```

---

### Issues Module

---

#### 3. Create Issue

**Endpoint:** `POST /api/issues`  
**Access:** Contributor, Maintainer  
**Headers:** `Authorization: <JWT_TOKEN>`

**Request Body**
```json
{
  "title": "Add dark mode support",
  "description": "Users are requesting a dark...",
  "type": "feature_request",
  "status": "in_progress"
}
```
> **Note:** `type` must be either `bug` or `feature_request`. Any other value returns a `400 Bad Request`.

> **Note:** `status` must be either `open`, `in_progress`, or `resolved`. Any other value returns a `400 Bad Request`.

**Success Response — `201 Created`**
```json
{
    "success": true,
    "message": "Issue created successfully",
    "data": {
        "id": 23,
        "title": "Add dark mode support",
        "description": "Users are requesting ...",
        "type": "feature_request",
        "status": "in_progress",
        "reporter_id": 21,
        "created_at": "2026-05-22T10:49:05.970Z",
        "updated_at": "2026-05-22T10:49:05.970Z"
    }
}
```

---

#### 4. Get All Issues

**Endpoint:** `GET /api/issues`  
**Access:** Public

**Query Parameters**

| Parameter | Accepted Values | Default |
|---|---|---|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | _(none — returns all)_ |
| `status` | `open`, `in_progress`, `resolved` | _(none — returns all)_ |

**Example Requests**
```
GET /api/issues?sort=newest
GET /api/issues?type=bug
GET /api/issues?status=open
GET /api/issues?type=bug&status=open
GET /api/issues?sort=newest&type=bug&status=open

```

**Success Response — `200 OK`**
```json
{
    "success": true,
    "data": [
        {
            "id": 23,
            "title": "Add dark mode support",
            "description": "Users are requesting a ...",
            "type": "feature_request",
            "status": "in_progress",
            "reporter": {
                "id": 21,
                "name": "Shahadat Hossain",
                "role": "maintainer"
            },
            "created_at": "2026-05-22T10:49:05.970Z",
            "updated_at": "2026-05-22T10:49:05.970Z"
        }
    ]
}
```

---

#### 5. Get Single Issue

**Endpoint:** `GET /api/issues/:id`  
**Access:** Public

**Success Response — `200 OK`**
```json
{
    "success": true,
    "data": {
        "id": 24,
        "title": "Implement email verification system",
        "description": "A verification email should be ...",
        "type": "feature_request",
        "status": "open",
        "reporter": {
            "id": 21,
            "name": "Shahadat Hossain",
            "role": "maintainer"
        },
        "created_at": "2026-05-22T10:55:30.108Z",
        "updated_at": "2026-05-22T10:55:30.108Z"
    }
}

```

---

#### 6. Update Issue

**Endpoint:** `PATCH /api/issues/:id`  
**Access:** Maintainer (any issue) · Contributor (own issue, only if status is `open`)  
**Headers:** `Authorization: <JWT_TOKEN>`

**Request Body** _(all fields optional)_
```json
{
    "title": "Add dark mode and system mode support",
    "description": "Users are requesting a dark..",
    "type": "bug",
    "status": "resolved"
}
```

**Success Response — `200 OK`**
```json
{
    "success": true,
    "message": "Issue updated successfully",
    "data": {
        "id": 23,
        "title": "Add dark mode and system mode support",
        "description": "Users are requesting a dark...",
        "type": "bug",
        "status": "resolved",
        "reporter_id": 21,
        "created_at": "2026-05-22T10:49:05.970Z",
        "updated_at": "2026-05-22T11:02:59.067Z"
    }
}
```

---

#### 7. Delete Issue

**Endpoint:** `DELETE /api/issues/:id`  
**Access:** Maintainer only  
**Headers:** `Authorization: <JWT_TOKEN>`

**Success Response — `200 OK`**
```json
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

---

## Response Patterns

### `✅ 200 OK` — Success
```json
{
  "success": true,
  "message": "Successful message",
  "data": {}
}
```

### `✅ 201 Created`
```json
{
  "success": true,
  "message": "Successful message",
  "data": {}
}
```

### `❌ 400 Bad Request`
```json
{
  "success": false,
  "message": "Invalid input",
  "data": null
}
```

### `🚫 401 Unauthorized`
```json
{
  "success": false,
  "message": "Unauthorized access!"
}
```

### `⛔ 403 Forbidden`
```json
{
  "success": false,
  "message": "Insufficient role/permissions"
}
```

### `🔍 404 Not Found`
```json
{
  "success": false,
  "message": "Not Found!!",
  "data": null
}
```

### `❌ 500 Internal Server Error`
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details"
}
```

# 🔑 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=port

CONNECTION_STRING=connection string from neonDB

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

# 🔒 Security Features

- Password Hashing with bcrypt
- JWT Token Authentication
- Protected Routes
- Role-based Authorization
- Secure Environment Variables
- Parameterized SQL Queries

---
