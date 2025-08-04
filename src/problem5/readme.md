

# Problem 5 - Modular Backend API

This is a modular Node.js + TypeScript backend API built using:
- **Express.js** (via `app` module)
- **MongoDB** (with Mongoose ODM)
- **InversifyJS** for dependency injection
- **Zod** for DTO validation
- **JWT** for authentication
- **Docker** for local development environments

---

## 📁 Project Structure
```
├── src/
│ ├── config/ # Environment config (e.g., env loader)
│ ├── modules/ # All business modules live here
│ │ └── users/ # User module (feature)
│ │ ├── handlers/ # Application logic (e.g., services/use-cases)
│ │ ├── models/ # Mongoose schemas & interfaces
│ │ ├── repositories/ # MongoDB access logic
│ │ ├── types/ # DTOs, validation schemas, interfaces
│ │ └── user.controller.ts # Express controller for user endpoints
│ ├── shared/ # Shared app bootstrapping (DI container, main app)
│ │ ├── bootstrap-app.ts
│ │ ├── bootstrap-container.ts
│ │ └── bootstrap-type.ts
│ └── main.ts # Entry point (loads DI container & starts server)
│
├── .env.example # Sample environment variables
├── docker-compose.*.yml # Docker setups for MongoDB, Redis, etc.
├── tsconfig.json # TypeScript config
├── package.json
└── readme.md # Project documentation
```


---

## 🧩 Module Design (Example: `users`)

Each module is structured in a clean and decoupled way:

| Folder/File           | Purpose |
|-----------------------|---------|
| `handlers/`           | Business logic: registering users, auth, etc. |
| `models/`             | Mongoose models and interfaces |
| `repositories/`       | Data access layer, uses models |
| `types/`              | Input validation schemas and DTOs (via Zod) |
| `user.controller.ts`  | Express controller, receives HTTP requests |

---

## 🚀 How to Run
### 1. Docker Setup

```bash
docker-compose -f docker-compose.mongo.yml up -d
docker-compose -f docker-compose.redis.yml up -d
```
### 2. Install dependencies

```bash
npm install
npm run start
```

### 3.  Test

```bash
  npm run test:local
```

Test by CURL
```
curl --location 'localhost:3001/users' \
--header 'Content-Type: application/json' \
--header 'x-api-key: xxxx-xxxx-xxxx-xxxx' \
--data '{
  "fullName": "Nguyen Van A",
  "userName": "nguyenvanb",
  "password": "SuperSecure123!"
}
'
```

### 4. Swagger

- http://localhost:3001/api-docs/#/Users/post_users

### 5. TODO

If I have enough time I will do all.

- Custom exception
- Apply cache
- Login
- Path Token
- Rate limiter
- Advanced security