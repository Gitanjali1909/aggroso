## Codebase Q&A Web App

This project is a full-stack web application built as a coding assessment submission. The main idea of the app is to help users ask questions about a codebase by providing context from either pasted code or a GitHub repository link.

### What the App Does

* Users can enter a repository URL or paste code directly.
* Users can ask questions about the code.
* The backend tries to provide helpful answers using AI assistance when available.
* If possible, the response may include:

  * File path information
  * Approximate line location
  * Small snippet evidence from the code

### Frontend

The frontend is built using React with Vite for faster development.

Pages include:

* Home page – Input repository or codebase and ask questions.
* Status page – Backend health check.
* Result page – Display AI response and code evidence.

The UI focuses on simplicity, loading feedback, and basic error handling.

### Backend

The backend is built using Node.js and Express.

It provides two main APIs:

* Health check endpoint to verify server status.
* Question answering endpoint that processes context and returns responses.

### Repository Handling

If a GitHub repository link is provided, the backend performs a lightweight recursive scan to extract readable code files within safe size limits.

The project does not use complex indexing or advanced search mechanisms. The focus is on keeping the implementation practical for assessment purposes.

### AI Usage

AI assistance is used as a development helper.

* If an API key is available, the application can generate answers using a language model.
* If AI service is not configured, the backend safely returns a fallback response.

The goal is to maintain a working application flow rather than relying completely on AI-generated output.
