const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;
const requestsByIp = new Map();

export function rateLimitMiddleware(req, res, next) {
  const now = Date.now();
  const ip = req.ip || req.connection?.remoteAddress || "unknown";
  const existing = requestsByIp.get(ip);

  if (!existing || now > existing.resetAt) {
    requestsByIp.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (existing.count >= MAX_REQUESTS) {
    return res.status(429).json({
      error: "Too many requests. Please try again later.",
    });
  }

  existing.count += 1;
  return next();
}

