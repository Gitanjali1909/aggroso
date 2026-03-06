Codebase Q&A Web App

A full-stack AI-powered web application that allows users to ask questions about a codebase and receive contextual answers derived from the repository or pasted code.

The goal of the project is to explore how AI can assist developers in understanding unfamiliar codebases quickly by surfacing relevant context, snippets, and explanations.

Key Features

• Ask questions about a codebase using natural language
• Provide context through either a GitHub repository link or pasted code
• AI-assisted responses with contextual explanations
• Code snippet evidence when relevant
• Simulated streaming response UI for a real-time feel
• Error boundaries for better frontend stability
• Structured backend logging for better debugging
• Responsive and minimal developer-focused interface

How It Works

A user provides either:

A GitHub repository URL

Or pasted code snippets

The backend extracts readable code files and prepares contextual input.

The user asks a question about the codebase.

The application sends the context and question to an AI model (if configured).

The response is returned along with helpful references such as:

File paths

Approximate locations in code

Relevant snippets

Tech Stack
Frontend

React

Vite

Tailwind CSS

Custom streaming UI hook (useTypewriter)

Error Boundary implementation for crash handling

Backend

Node.js

Express

Structured request logging

Lightweight repository scanning

Repository Processing

When a GitHub repository link is provided, the backend performs a lightweight recursive scan to extract readable code files.

Safety constraints are applied:

File size limits

Readable text files only

No heavy indexing or vector databases

This keeps the implementation simple, efficient, and suitable for smaller repositories.

AI Integration

AI is used to generate contextual answers based on the extracted code.

If an API key is configured, the backend can query a language model to generate responses.
If AI services are unavailable, the application gracefully returns a fallback response to maintain the user flow.

Project Goals

This project focuses on:

Building a practical AI-assisted developer tool

Demonstrating full-stack integration

Designing a clean developer-focused UI

Implementing production-style improvements such as structured logging, error boundaries, and progressive response rendering.
