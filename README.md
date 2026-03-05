# Codebase Q&A Web App

A full-stack web application that lets users **ask questions about a codebase** and receive AI-assisted answers with supporting context.

The app allows users to provide either a **GitHub repository URL** or **pasted code**, then ask natural-language questions about it. The backend processes the code context and returns structured responses that may include relevant snippets and file locations.

This project demonstrates full-stack development, API integration, and building an AI-assisted developer tool.

---

## Features

• Ask questions about any codebase
• Accepts either a **GitHub repository link** or **pasted source code**
• AI-assisted responses with contextual understanding
• Optional **file path and line reference hints**
• Streaming-style response display for better UX
• Loading states and error handling
• Backend health monitoring endpoint
• Clean, minimal developer-tool style UI

---

## Tech Stack

**Frontend**

* React
* Vite
* Tailwind CSS
* Custom `useTypewriter` hook for streaming response UI
* Error Boundary for UI crash handling

**Backend**

* Node.js
* Express
* REST APIs
* Structured logging

**AI Integration**

* OpenAI API (optional)

If the API key is not configured, the backend gracefully falls back to a non-AI response.

---

## How It Works

1. User provides a **GitHub repository URL** or pastes code.
2. The backend scans the repository or uses the provided code as context.
3. The user asks a natural-language question.
4. The backend processes the request and sends context to the AI model (if configured).
5. The response is returned and displayed in the UI with a **typing/streaming effect**.

---

## Repository Scanning

When a GitHub repository link is provided, the backend performs a **lightweight recursive scan** to extract readable source files.

Safety limits are applied:

* File size limits
* Supported text/code file types
* Maximum processing depth

This keeps the system lightweight and prevents large repository overload.

---

## API Endpoints

### Health Check

```
GET /health
```

Returns server status to verify backend availability.

---

### Ask Question

```
POST /ask
```

Request body example:

```
{
  "question": "Where is authentication handled?",
  "repoUrl": "https://github.com/example/project"
}
```

Response may include:

* Answer text
* File reference hints
* Relevant code snippet

---

## Running the Project Locally

### 1. Clone the Repository

```
git clone https://github.com/your-username/codebase-qa-app.git
cd codebase-qa-app
```

---

### 2. Setup Backend

```
cd backend
npm install
```

Create a `.env` file:

```
OPENAI_API_KEY=your_api_key_here
PORT=5000
```

Run the server:

```
npm run dev
```

---

### 3. Setup Frontend

```
cd ../frontend
npm install
npm run dev
```

The frontend will start on:

```
http://localhost:5173
```

---

## UI Improvements Implemented

The interface was intentionally designed to resemble modern developer tools such as
GitHub dashboards and
Vercel admin panels.

Enhancements include:

* Cleaner spacing and layout hierarchy
* Streaming response display
* Responsive design
* Error Boundary protection
* Improved loading feedback

The goal was a **minimal but production-like UI** rather than a heavily styled interface.

---

## Structured Backend Logging

The backend uses structured logging to make debugging easier.

Example log output:

```
[2026-02-28T12:30:45.000Z] [POST /ask] QuestionLength=42 RepoUrl=true
```

This provides quick visibility into request metadata during development.

---

## Limitations

This project intentionally avoids heavy infrastructure to keep the implementation practical.

Not included:

* Large-scale repository indexing
* Vector databases
* Advanced code embeddings
* Full semantic search

The focus is on demonstrating **core architecture and AI integration**, not building a production-scale code search engine.

---

## Author

**Gitanjali Soni**

Computer Science student focused on building modern web applications and AI-assisted tools.

---

## Future Improvements

Possible upgrades:

* Vector embeddings for better code retrieval
* Semantic search over repositories
* GitHub OAuth for repository access
* Streaming responses from backend
* Code highlighting for snippets
