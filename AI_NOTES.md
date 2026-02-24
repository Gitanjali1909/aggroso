# AI Notes

## Approach

The backend uses a two-step AI flow:

1. Build contextual input from either:
   - User-pasted codebase text, or
   - Lightweight GitHub repository extraction.
2. Send context + question to OpenAI using a code-assistant system prompt.

## Prompting Strategy

- System prompt constrains behavior to code-grounded answers.
- User prompt requires JSON output with:
  - `answer`
  - `citations[]` containing file path, line range, snippet
- If exact line numbers are unavailable, model is told to estimate.

## Safety and Reliability

- Request validation ensures question and context are present.
- Repo extraction has limits on total files and text size.
- If OpenAI key is missing, API returns a simulated response instead of crashing.

## Known Limitations

- No vector index or semantic retrieval.
- GitHub extraction uses simple recursive content traversal and may skip large/binary files.
- Citation quality depends on model output quality.