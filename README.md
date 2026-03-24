# Songkran Online Platform
(Payment Status: Deposit Paid)
<img width="1762" height="1017" alt="image" src="https://github.com/user-attachments/assets/2bae4233-70bb-4bde-834b-016da97cef2c" />
A virtual platform for participating in the Thai New Year (Songkran) festival online. Users can join in water splashing, pour water on Buddha statues (Song Nam Phra), and send digital blessings to each other across various devices with a seamless and interactive experience.

## Key Features

* **Virtual Water Play:** Users can customize their character and select locations to simulate online water splashing activities.
* **Song Nam Phra:** A digital setup for the traditional bathing of the Buddha statue to receive blessings.
* **Blessing System:** A dedicated flow for users to write and exchange New Year wishes with others.
* **Social Authentication:** Secure and easy login mechanisms via Line, Google, and Facebook.
* **Activity & User Tracking:** Comprehensive tracking of user activities, access logs, IP addresses, and user agents for analytics.

## Technologies Used

This project follows a monorepo-style structure, clearly separating the Client (Frontend) and API (Backend) to maintain organized codebases.

### Frontend
* **Framework:** Next.js 16+ (React 19) utilizing the App Router for SEO optimization and fast load times.
* **Styling:** Tailwind CSS v4 for rapid UI development and responsive design.
* **Architecture:** Feature-Sliced Design (FSD) - A clean architectural approach that ensures scalability, loose coupling, and maintainability.

### Backend
* **Runtime & Framework:** Node.js + Express.js (v5) utilizing the latest capabilities for middleware and asynchronous request handling.
* **Database & ORM:** PostgreSQL paired with Prisma ORM for 100% type-safe database queries.
* **API Documentation:** Integrated Swagger (OpenAPI) for interactive API documentation and testing.
* **Authentication:** JWT (JSON Web Token) for stateless user authentication post OAuth login.

### Infrastructure & Deployment
* **Frontend:** Deployed on Vercel for automatic edge CDN distribution.
* **Backend:** Hosted on a Lightnode VPS, utilizing Nginx as a Reverse Proxy and PM2 for process management.
* **Database Hosting:** PostgreSQL database running inside a Docker Container for isolation and easy migration.
* **CI/CD Script:** Custom `deploy.sh` script to automate code pulls, dependency installations, builds, Prisma migrations, and zero-downtime PM2 reloads.

## Technical Highlights & High Performance

1. **Bleeding Edge Stack:** Built with the latest technologies including React 19, Tailwind CSS v4, and Express 5 to maximize performance and developer experience.
2. **End-to-End Type Safety:** Leveraging TypeScript across the entire ecosystem alongside Prisma ORM to prevent runtime type mismatch errors between the database and the client.
3. **FSD Architecture (Frontend):** Structured using Feature-Sliced Design (`app/`, `features/`, `entities/`, `shared/`) to eliminate "spaghetti code". Each domain and feature is properly decoupled.
4. **Zero-Downtime Deployment Ready:** Configured with PM2's `ecosystem.config.js` (`autorestart` and `max_memory_restart`) and an automated deployment script to ensure seamless updates without impacting active users.
5. **Scalable Logging System:** Database models (`ActivityAccessLog`, `WaterPlayLog`) are designed to withstand and capture high-throughput event data, preparing the platform for comprehensive data analytics and dashboards.

## Getting Started

### 1. Database Setup (Docker)
Start the database container first:
```bash
docker-compose up -d db
```

### 2. Backend (API)
Runs on port `4000` by default.
```bash
cd songkran-online-api
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

### 3. Frontend (Client)
Ensure environment variables point to the backend API correctly.
```bash
cd songkran-online-client
npm install
npm run dev
```

> **Note:** Proper environment variables (`.env`), including `DATABASE_URL` and OAuth credentials, must be configured prior to starting the application.
