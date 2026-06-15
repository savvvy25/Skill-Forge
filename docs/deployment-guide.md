# 🚀 SkillForge Deployment Guide

> Complete step-by-step instructions for deploying SkillForge to production using **Neon** (Database), **Render** (Backend), and **Vercel** (Frontend).

---

## Table of Contents

- [Deployment Architecture](#deployment-architecture)
- [Step 1: Neon PostgreSQL (Database)](#step-1-neon-postgresql-database)
- [Step 2: Render (Backend)](#step-2-render-backend)
- [Step 3: Vercel (Frontend)](#step-3-vercel-frontend)
- [Environment Variables Reference](#environment-variables-reference)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Troubleshooting](#troubleshooting)

---

## Deployment Architecture

```mermaid
graph LR
    subgraph User["👤 End User"]
        Browser["Browser"]
    end

    subgraph Vercel["Vercel"]
        FE["React App<br/>(Static Files)"]
    end

    subgraph Render["Render"]
        BE["Spring Boot<br/>(Java 17)"]
    end

    subgraph Neon["Neon"]
        DB[("PostgreSQL<br/>Database")]
    end

    Browser -->|"HTTPS"| FE
    FE -->|"API Calls"| BE
    BE -->|"JDBC"| DB

    style Vercel fill:#000,stroke:#fff,color:#fff
    style Render fill:#0d1b2a,stroke:#46E3B7,color:#fff
    style Neon fill:#0a1628,stroke:#00e5a0,color:#fff
```

> [!IMPORTANT]
> Deploy in this exact order: **Database → Backend → Frontend**. Each step depends on outputs from the previous one.

---

## Step 1: Neon PostgreSQL (Database)

[Neon](https://neon.tech/) provides serverless PostgreSQL with a generous free tier — perfect for production deployments.

### 1.1 Create a Neon Account

1. Navigate to [https://neon.tech](https://neon.tech/)
2. Click **Sign Up** and create an account (GitHub SSO recommended)
3. Verify your email address

### 1.2 Create a New Project

1. From the Neon Dashboard, click **New Project**
2. Configure the project:

   | Setting | Value |
   |---|---|
   | **Project Name** | `skillforge` |
   | **PostgreSQL Version** | `15` (or latest) |
   | **Region** | Choose closest to your users (e.g., `US East - Ohio`) |
   | **Compute Size** | `0.25 vCPU` (free tier) |

3. Click **Create Project**

### 1.3 Get Connection Details

After project creation, Neon displays the connection details. **Save these — you'll need them for Render.**

From the Neon Dashboard → **Connection Details** panel, note down:

| Variable | Where to Find | Example Value |
|---|---|---|
| `DATABASE_URL` | Connection string (JDBC) | `jdbc:postgresql://ep-cool-name-123456.us-east-2.aws.neon.tech/skillforge?sslmode=require` |
| `DATABASE_USERNAME` | Username field | `skillforge_owner` |
| `DATABASE_PASSWORD` | Password field (click 👁️ to reveal) | `aBcDeFgHiJkL1234` |

> [!TIP]
> In the Neon Dashboard, select **Java** as the connection type to get the JDBC-formatted connection string directly.

### 1.4 Verify Connection (Optional)

Test the connection from your local machine:

```bash
psql "postgresql://skillforge_owner:aBcDeFgHiJkL1234@ep-cool-name-123456.us-east-2.aws.neon.tech/skillforge?sslmode=require"
```

If you see the `psql` prompt, your database is ready.

> [!NOTE]
> Neon databases auto-suspend after 5 minutes of inactivity on the free tier. The first request after suspension may take 1-2 seconds for a "cold start."

---

## Step 2: Render (Backend)

[Render](https://render.com/) provides managed hosting for web services with automatic deploys from GitHub.

### 2.1 Create a Render Account

1. Navigate to [https://render.com](https://render.com/)
2. Sign up using your **GitHub** account (enables automatic deploys)

### 2.2 Create a New Web Service

1. From the Render Dashboard, click **New** → **Web Service**
2. Connect your GitHub repository containing the SkillForge project
3. Configure the service:

   | Setting | Value |
   |---|---|
   | **Name** | `skillforge-backend` |
   | **Region** | Choose closest to your Neon database region |
   | **Branch** | `main` |
   | **Root Directory** | `skillforge-backend` |
   | **Runtime** | `Docker` or `Java` |
   | **Build Command** | `./mvnw clean package -DskipTests` |
   | **Start Command** | `java -jar target/skillforge-backend-0.0.1-SNAPSHOT.jar` |
   | **Instance Type** | `Free` (or `Starter` for no cold starts) |

### 2.3 Set Environment Variables

In the Render service settings, navigate to **Environment** → **Environment Variables** and add:

| Key | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `jdbc:postgresql://ep-cool-name-123456.us-east-2.aws.neon.tech/skillforge?sslmode=require` | From Neon — Step 1.3 |
| `DATABASE_USERNAME` | `skillforge_owner` | From Neon — Step 1.3 |
| `DATABASE_PASSWORD` | `aBcDeFgHiJkL1234` | From Neon — Step 1.3 |
| `JWT_SECRET` | `a-very-long-random-256-bit-secret-key-for-jwt-signing-minimum-32-chars` | Generate with `openssl rand -base64 64` |
| `CORS_ORIGINS` | `https://skillforge.vercel.app` | Your Vercel URL (update after Vercel deploy) |
| `JAVA_VERSION` | `17` | Ensures correct JDK |
| `MAVEN_OPTS` | `-Xmx512m` | Memory limit for build |

> [!WARNING]
> The `JWT_SECRET` must be at least 256 bits (32+ characters) for HS256 signing. Use a cryptographically random string. Never reuse secrets across environments.

### 2.4 Deploy

1. Click **Create Web Service**
2. Render will automatically build and deploy your backend
3. Monitor the build logs for any errors
4. Once deployed, note your **service URL** (e.g., `https://skillforge-backend.onrender.com`)

### 2.5 Verify Backend Deployment

Test the deployed backend:

```bash
# Test health (if endpoint exists)
curl https://skillforge-backend.onrender.com/api/auth/health

# Test registration
curl -X POST https://skillforge-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"TestP@ss123"}'
```

> [!NOTE]
> Render free tier services spin down after 15 minutes of inactivity. The first request after spin-down takes 30-60 seconds. Consider upgrading to the Starter plan for production use.

---

## Step 3: Vercel (Frontend)

[Vercel](https://vercel.com/) provides instant static site deployment with a global CDN — ideal for React/Vite applications.

### 3.1 Create a Vercel Account

1. Navigate to [https://vercel.com](https://vercel.com/)
2. Sign up with your **GitHub** account

### 3.2 Import the Project

1. From the Vercel Dashboard, click **Add New…** → **Project**
2. Select **Import Git Repository** and choose your SkillForge repository
3. Configure the project:

   | Setting | Value |
   |---|---|
   | **Project Name** | `skillforge` |
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `skillforge-frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
   | **Install Command** | `npm install` |

### 3.3 Set Environment Variables

In the Vercel project settings, navigate to **Settings** → **Environment Variables** and add:

| Key | Value | Environments |
|---|---|---|
| `VITE_API_URL` | `https://skillforge-backend.onrender.com` | Production, Preview, Development |

> [!IMPORTANT]
> Vite environment variables **must** be prefixed with `VITE_` to be accessible in the browser. The variable is embedded at build time, not runtime.

### 3.4 Deploy

1. Click **Deploy**
2. Vercel will build and deploy your frontend
3. Your app will be available at `https://skillforge.vercel.app` (or your custom domain)

### 3.5 Configure Rewrites for React Router

Create or verify the following file exists at `skillforge-frontend/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures React Router handles all routes correctly (prevents 404 on page refresh).

### 3.6 Update CORS on Render

Now that you have your Vercel URL, go back to Render and update the `CORS_ORIGINS` environment variable:

```
CORS_ORIGINS=https://skillforge.vercel.app
```

If you have multiple frontend origins (e.g., custom domain + vercel URL):

```
CORS_ORIGINS=https://skillforge.vercel.app,https://skillforge.yourdomain.com
```

Render will automatically redeploy after updating environment variables.

---

## Environment Variables Reference

### Complete Variable Map

| Variable | Service | Required | Description | Example Value |
|---|---|---|---|---|
| `DATABASE_URL` | Backend (Render) | ✅ | JDBC connection string to PostgreSQL | `jdbc:postgresql://ep-xxx.neon.tech/skillforge?sslmode=require` |
| `DATABASE_USERNAME` | Backend (Render) | ✅ | PostgreSQL user | `skillforge_owner` |
| `DATABASE_PASSWORD` | Backend (Render) | ✅ | PostgreSQL password | `aBcDeFgHiJkL1234` |
| `JWT_SECRET` | Backend (Render) | ✅ | JWT signing secret (256-bit minimum) | `openssl rand -base64 64` output |
| `CORS_ORIGINS` | Backend (Render) | ✅ | Allowed frontend origins | `https://skillforge.vercel.app` |
| `JAVA_VERSION` | Backend (Render) | ⬜ | Java runtime version | `17` |
| `MAVEN_OPTS` | Backend (Render) | ⬜ | Maven JVM options | `-Xmx512m` |
| `VITE_API_URL` | Frontend (Vercel) | ✅ | Backend API base URL | `https://skillforge-backend.onrender.com` |

### Local Development Variables

| File | Variable | Value |
|---|---|---|
| `skillforge-backend/.env` | `DATABASE_URL` | `jdbc:postgresql://localhost:5432/skillforge` |
| `skillforge-backend/.env` | `DATABASE_USERNAME` | `postgres` |
| `skillforge-backend/.env` | `DATABASE_PASSWORD` | `password` |
| `skillforge-backend/.env` | `JWT_SECRET` | `dev-secret-key-at-least-32-characters-long-for-testing` |
| `skillforge-backend/.env` | `CORS_ORIGINS` | `http://localhost:5173` |
| `skillforge-frontend/.env` | `VITE_API_URL` | `http://localhost:8080` |

---

## Post-Deployment Checklist

Use this checklist to verify your deployment is fully operational:

### ✅ Database (Neon)

- [ ] Neon project created and accessible
- [ ] Connection string tested successfully
- [ ] Tables auto-created on first backend startup (`users`, `dsa_progress`)
- [ ] SSL mode enabled (`sslmode=require` in connection string)

### ✅ Backend (Render)

- [ ] Build completes without errors in Render logs
- [ ] Application starts successfully (check for `Started SkillforgeApplication` in logs)
- [ ] All environment variables set correctly
- [ ] `CORS_ORIGINS` matches your Vercel frontend URL
- [ ] `POST /api/auth/register` returns `201 Created`
- [ ] `POST /api/auth/login` returns JWT token
- [ ] Protected endpoints return `401` without token and `200` with valid token

### ✅ Frontend (Vercel)

- [ ] Build completes without errors
- [ ] `VITE_API_URL` points to the correct Render backend URL
- [ ] App loads in the browser
- [ ] Login and registration forms work end-to-end
- [ ] Dashboard displays data after login
- [ ] Page refresh on protected routes works (vercel.json rewrites configured)
- [ ] No mixed content warnings (HTTP vs HTTPS)

### ✅ Integration

- [ ] Register a new user through the frontend
- [ ] Login with the registered user
- [ ] Add DSA progress entries
- [ ] View dashboard with charts populated
- [ ] Update and delete progress entries
- [ ] Logout and verify protected routes redirect to login

---

## Troubleshooting

### Common Issues

#### Backend fails to connect to Neon database

```
org.postgresql.util.PSQLException: Connection refused
```

**Solution:** Ensure `sslmode=require` is appended to your `DATABASE_URL`. Neon requires SSL connections.

#### CORS errors in browser console

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:** Verify `CORS_ORIGINS` on Render matches your exact Vercel URL (including `https://`, no trailing slash).

#### 404 on page refresh (Vercel)

**Solution:** Ensure `vercel.json` exists in `skillforge-frontend/` with the rewrite rule:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

#### Render cold start taking too long

**Solution:** Free-tier Render services spin down after inactivity. Options:
1. Upgrade to the Starter plan ($7/month) for always-on
2. Use a cron job to ping your backend every 14 minutes
3. Accept the 30-60s cold start on first request

#### JWT token rejected after redeployment

**Solution:** Ensure `JWT_SECRET` remains the same across redeployments. If the secret changes, all existing tokens become invalid and users must log in again.

---

<div align="center">

**Need help?** Open an issue on the [GitHub repository](https://github.com/yourusername/skillforge/issues).

</div>
