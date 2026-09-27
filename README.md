# Urbn — Local Service Booking Platform

A full-stack app for booking local service providers (electricians, plumbers,
carpenters, AC repair, cleaning, etc.), with three roles: **CUSTOMER**,
**PROVIDER**, and **ADMIN**.

## 1. Overview

- Customers browse/search services, book them, track status, and cancel.
- Providers list their services and manage incoming bookings (accept, reject,
  mark complete).
- Admins see platform-wide stats and manage users, services, and bookings.

## 2. Technologies

**Backend:** Java 21+, Spring Boot 4, Spring Web, Spring Security, JWT,
Spring Data JPA (Hibernate), Bean Validation, PostgreSQL, Maven.

**Frontend:** React 18, Vite, JavaScript (no TypeScript), Tailwind CSS,
React Router, Axios.

## 3. Folder structure

```
Urbn-Backend/     Spring Boot API (controller/service/repository/entity/dto/security/exception/config)
Urbn-Frontend/    React app (components/pages/layouts/routes/services/context/hooks/utils)
```

## 4. PostgreSQL setup

```sql
CREATE DATABASE urbn_db;
```

Hibernate's `ddl-auto=update` creates/updates tables automatically on
startup — no manual schema scripts needed.

## 5. Backend setup & run

```bash
cd Urbn-Backend
# edit src/main/resources/application.properties if your Postgres
# username/password differ from the defaults
./mvnw spring-boot:run
```

Starts on `http://localhost:8080`. First run downloads dependencies, so it
needs internet access once.

## 6. Frontend setup & run

```bash
cd Urbn-Frontend
cp .env.example .env    # points the app at http://localhost:8080/api
npm install
npm run dev
```

Starts on `http://localhost:5173` (the backend's CORS config already allows
this origin).

## 7. API endpoints

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/users/me` | Bearer (any) |
| PUT | `/api/users/me` | Bearer (any) |
| GET | `/api/users/providers` | Bearer (any) |
| GET | `/api/services?category=&q=` | Public |
| GET | `/api/services/{id}` | Public |
| GET | `/api/services/my` | Bearer: PROVIDER/ADMIN |
| POST | `/api/services` | Bearer: PROVIDER/ADMIN |
| PUT | `/api/services/{id}` | Bearer: PROVIDER/ADMIN (owner) |
| DELETE | `/api/services/{id}` | Bearer: PROVIDER/ADMIN (owner) |
| PATCH | `/api/services/{id}/active?active=` | Bearer: PROVIDER/ADMIN (owner) |
| POST | `/api/bookings` | Bearer: CUSTOMER/ADMIN |
| GET | `/api/bookings/{id}` | Bearer (participant/admin) |
| GET | `/api/bookings/my` | Bearer (any) |
| GET | `/api/bookings/provider` | Bearer: PROVIDER/ADMIN |
| PUT | `/api/bookings/{id}/status` | Bearer: PROVIDER/ADMIN (owner) |
| PUT | `/api/bookings/{id}/cancel` | Bearer (owner/admin) |
| POST | `/api/feedback` | Bearer: CUSTOMER/ADMIN |
| GET | `/api/feedback/service/{id}` | Public |
| GET | `/api/feedback/{id}` | Bearer (any) |
| GET | `/api/admin/dashboard` | Bearer: ADMIN |
| GET | `/api/admin/users` | Bearer: ADMIN |
| GET | `/api/admin/users/{id}` | Bearer: ADMIN |
| PUT | `/api/admin/users/{id}/role` | Bearer: ADMIN |
| DELETE | `/api/admin/users/{id}` | Bearer: ADMIN |
| GET | `/api/admin/providers` | Bearer: ADMIN |
| GET | `/api/admin/services` | Bearer: ADMIN |
| GET | `/api/admin/bookings` | Bearer: ADMIN |

Booking status values: `PENDING → ACCEPTED/REJECTED → COMPLETED`, or
`CANCELLED` from `PENDING`/`ACCEPTED`.

## 8. Test accounts / admin setup

There's no seed data. Register your first accounts through the UI:

1. Register a normal account — it defaults to `CUSTOMER`, or pick `PROVIDER`
   on the registration form.
2. There's no public way to create an `ADMIN` (by design — registration
   rejects it). To get an admin account, register a normal account, then
   promote it directly in the database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';
   ```
   Log out and back in afterwards so a fresh JWT carries the new role.

## 9. Known limitations / notes

- The environment used to build this couldn't run `npm install` or `mvn`
  live (no network access in that sandbox). The backend's compilation was
  verified against a prior successful build already bundled in the project;
  the frontend's 39 source files were verified with esbuild's JSX
  parser/transformer (catches syntax errors, not missing-dependency or
  type issues). Please run both once locally to confirm end-to-end.
- Services have no `location` field in this schema (only category and a
  per-booking `address`) — if you need a separate provider service area,
  that's a small additive change to the `ServiceItem` entity/DTOs.
- No automated test suite beyond the generated `BackendApplicationTests`
  context-load smoke test.
