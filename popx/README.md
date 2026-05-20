# PopX (Frontend + Backend)

This project contains:

- A React + Vite frontend in `src/`
- An Express + MongoDB API in `api/`
- Vercel configuration for static frontend + serverless API deployment

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill in real values.

3. Run backend:

```bash
npm run server
```

4. Run frontend (in another terminal):

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and API on `http://localhost:5000`.

## Environment Variables

Set these in `.env` (local) and in Vercel Project Settings (production):

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: strong random string for signing JWTs
- `CLIENT_ORIGIN`: comma-separated allowed frontend origins (for CORS), e.g. `https://your-app.vercel.app`
- `VITE_API_URL`: API base URL for frontend, keep `/api` for same-domain deployment
- `PORT`: local API port (optional on Vercel)

## Deploy To Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add production environment variables listed above.
4. Deploy.

`vercel.json` is configured to:

- Build frontend static assets (`dist/`)
- Deploy `api/index.js` as a serverless function
- Route `/api/*` requests to the API
- Route non-API paths to `index.html` for SPA navigation
