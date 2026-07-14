"use client";

import { useEffect, useState } from "react";

function getGreeting(hour: number) {
  if (hour < 5) return "Still up? Respect the grind 🌙";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Burning the midnight oil";
}

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
      <span className="font-display text-lg font-semibold text-paper">
        {getGreeting(now.getHours())} 😀
      </span>
      <span className="font-mono text-xs text-paper/50">
        {dateStr} · {timeStr}
      </span>
    </div>
  );
}
