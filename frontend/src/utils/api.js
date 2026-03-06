const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://aggroso-25mu.onrender.com";

const REQUEST_TIMEOUT_MS = 15_000;

async function request(path, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "Request failed");
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

export function fetchHealth() {
  return request("/health", {}, 10_000);
}

export function askQuestion(payload) {
  return request("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

