# 📊 Sales Insight Automator

> Upload sales datasets, generate AI-powered executive summaries using Google Gemini, and automatically email results to stakeholders.

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🏗️ Architecture

```
User → Upload CSV/XLSX + Email
         │
     ┌────▼────┐
     │ Frontend │  (Next.js / React / TailwindCSS)
     └────┬────┘
          │ POST /api/upload (multipart/form-data)
     ┌────▼────┐
     │ Backend  │  (Express.js / TypeScript)
     │          │
     │  ├── Parse CSV/XLSX
     │  ├── Send data → Google Gemini
     │  ├── Generate executive summary
     │  └── Email summary via Resend
     └─────────┘
```

### Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| **Frontend** | Next.js, React, TypeScript, TailwindCSS, Axios        |
| **Backend**  | Express.js, TypeScript, Multer, csv-parser, xlsx      |
| **AI**       | Google Gemini API (gemini-1.5-flash)                  |
| **Email**    | Resend API                                             |
| **Security** | Helmet, CORS, Express Rate Limit                      |
| **Docs**     | Swagger / OpenAPI 3.0                                  |
| **DevOps**   | Docker, Docker Compose, GitHub Actions CI             |

---

## 📁 Project Structure

```
sales-insight-automator/
├── backend/
│   ├── src/
│   │   ├── config/        # env.ts, swagger.ts
│   │   ├── controllers/   # uploadController.ts
│   │   ├── middlewares/    # errorHandler, rateLimiter, validateFile
│   │   ├── routes/        # uploadRoutes.ts
│   │   ├── services/      # aiService, emailService, fileParserService
│   │   ├── types/         # sales.ts
│   │   ├── utils/         # logger.ts
│   │   └── index.ts       # Entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── components/    # Header, UploadForm, StatusMessage
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

---

## 🔌 API Endpoints

### `GET /health`

Health check endpoint.

```json
{
  "status": "ok",
  "service": "Sales Insight Automator API",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### `POST /api/upload`

Upload a CSV/XLSX sales dataset and receive an AI-generated summary via email.

| Field   | Type   | Description                      |
|---------|--------|----------------------------------|
| `file`  | File   | `.csv` or `.xlsx` (max 5MB)      |
| `email` | String | Recipient email address          |

**Success Response:**
```json
{ "message": "Summary generated and sent successfully" }
```

**Error Response:**
```json
{ "error": "Invalid file type" }
```

### `GET /docs`

Interactive Swagger API documentation.

---

## 🐳 Running with Docker

```bash
# 1. Clone the repo
git clone https://github.com/your-username/Sales-Insight-Automator.git
cd Sales-Insight-Automator

# 2. Create backend .env file
cp backend/.env.example backend/.env
# Fill in your API keys in backend/.env

# 3. Start the backend
docker-compose up --build
```

The API will be available at **http://localhost:8000**

---

## 💻 Local Development (Without Docker)

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Fill in your API keys
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # Set NEXT_PUBLIC_API_URL
npm run dev
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable        | Description                          | Default                   |
|-----------------|--------------------------------------|---------------------------|
| `PORT`          | Server port                          | `8000`                    |
| `GEMINI_API_KEY`| Google Gemini API key                | **Required**              |
| `RESEND_API_KEY`| Resend email API key                 | **Required**              |
| `EMAIL_FROM`    | Sender email address                 | `onboarding@resend.dev`   |
| `CORS_ORIGIN`   | Allowed frontend origin              | `http://localhost:3000`   |
| `NODE_ENV`      | Environment mode                     | `production`              |

### Frontend (`frontend/.env.local`)

| Variable              | Description    | Default                  |
|-----------------------|----------------|--------------------------|
| `NEXT_PUBLIC_API_URL` | Backend URL    | `http://localhost:8000`  |

---

## 📖 Swagger Docs

Once the backend is running:

```
http://localhost:8000/docs
```

---

## 🚀 Deployment

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm run start`
   - **Environment:** Node
4. Add all environment variables from `.env.example`
5. Deploy

### Frontend → Vercel

1. Import your repo on [Vercel](https://vercel.com)
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (e.g., `https://your-app.onrender.com`)
4. Deploy

---

## 📊 Expected Dataset Format

| Column           | Type   | Example          |
|------------------|--------|------------------|
| Date             | String | 2026-01-05       |
| Product_Category | String | Electronics      |
| Region           | String | North            |
| Units_Sold       | Number | 150              |
| Unit_Price       | Number | 1200             |
| Revenue          | Number | 180000           |
| Status           | String | Shipped          |

---

## 🛡️ Security Features

- **Helmet** — Secure HTTP headers
- **CORS** — Configurable origin whitelist
- **Rate Limiting** — 100 req/15min global, 10 req/15min for uploads
- **File Validation** — Type checking + 5MB size limit
- **Input Sanitization** — Email format validation
- **Error Handling** — Centralized middleware with sanitized responses

---

## 📜 License

MIT — Powered by [Rabbitt AI](https://rabbittai.com)
