## AI Notes

### How the backend works

The application uses AI to help answer questions about codebases.

When a user asks a question, the backend first collects context. This context can come from:

* Code text pasted by the user, or
* Content fetched from a GitHub repository (if a repo link is provided).

After getting the context, the question and code information are sent to the AI model with simple instructions to act like a code helper and provide helpful answers.

The AI is asked to try giving:

* The answer to the question
* File path or location of code when possible
* Small code snippet evidence if it is available

### Reliability Handling

* The backend checks if question and context are provided before calling AI.
* Repository scanning is kept lightweight to avoid processing very large projects.
* If the AI service key is not available or the request fails, the system returns a safe fallback response instead of crashing.

### Limitations

* The project does not use advanced vector search or deep code indexing.
* Large repositories or binary files may not be fully processed.
* Snippet accuracy depends on model response quality.

This project focuses on providing a working, practical code assistant workflow rather than implementing complex research-level AI retrieval systems.
