# Codebase Q&A Web App

A full-stack coding assessment project that lets users ask questions about a pasted codebase or a GitHub repository URL.

## Features

- React (Vite) frontend with pages:
  - Home (`/`) for repo/codebase input + question form
  - Status (`/status`) for backend health checks
  - Result (`/result`) for AI answers and snippet evidence
- Node.js + Express backend APIs:
  - `GET /health`
  - `POST /ask`
- OpenAI integration with code-assistant system instruction
- Basic GitHub repository content extraction (recursive, lightweight)
- Last 10 Q&A entries saved in `localStorage`
- Loading and error handling in UI

## Project Structure

- `frontend/` React app
- `backend/` Express API + AI/repo services
- `README.md`, `AI_NOTES.md`, `ABOUTME.md`, `PROMPTS_USED.md`

## Prerequisites

- Node.js 18+
- npm
- OpenAI API key (optional but recommended)

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Configure environment files:

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`
- Set `OPENAI_API_KEY` in `backend/.env`

3. Run backend (Terminal 1):

```bash
npm run dev:backend
```

4. Run frontend (Terminal 2):

```bash
npm run dev:frontend
```

5. Open the frontend URL from Vite (typically `http://localhost:5173`).

## API Contracts

### `GET /health`

Returns status metadata.

### `POST /ask`

Request body:

```json
{
  "repoUrl": "https://github.com/owner/repo",
  "codebase": "optional pasted code",
  "question": "How does auth work?"
}
```

Response body:

```json
{
  "question": "...",
  "answer": "...",
  "citations": [
    {
      "filePath": "src/auth.js",
      "lineStart": 12,
      "lineEnd": 31,
      "snippet": "..."
    }
  ],
  "model": "gpt-4.1-mini",
  "sourceType": "github"
}
```

## Notes

- If `OPENAI_API_KEY` is missing, backend returns a simulated fallback answer.
- GitHub extraction is intentionally simple and bounded for assessment scope.