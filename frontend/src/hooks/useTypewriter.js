import { useEffect, useMemo, useState } from "react";

const DEFAULT_SPEED = 20;

function clampSpeed(value) {
  const speed = Number(value);
  if (!Number.isFinite(speed) || speed <= 0) {
    return DEFAULT_SPEED;
  }
  return speed;
}

export function useTypewriter(fullText, speed = DEFAULT_SPEED) {
  const safeText = useMemo(() => (typeof fullText === "string" ? fullText : ""), [fullText]);
  const [revealedText, setRevealedText] = useState("");

  useEffect(() => {
    if (!safeText) {
      setRevealedText("");
      return;
    }

    const intervalMs = clampSpeed(speed);
    let index = 0;
    setRevealedText("");

    const timer = window.setInterval(() => {
      index += 1;
      setRevealedText(safeText.slice(0, index));

      if (index >= safeText.length) {
        window.clearInterval(timer);
      }
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [safeText, speed]);

  return revealedText;
}

