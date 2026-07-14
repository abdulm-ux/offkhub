"use client";

import { useEffect, useMemo, useState } from "react";

const MEMES = [
  "Read that book before the book reads your life. 📚",
  "Go and study. Your fyb with your mate is important. 😭",
  "Open page one and start your comeback. ✍️",
  "Library today, peace of mind tomorrow. 😌",
  "Your pen is not for vibes only. Use am. 🖊️",
  "Read small. Stress small. Pass big. 📖",
  "Touch book now. Cry later if needed. 😂",
  "Lock in. The exam no be your friend. 😮‍💨",
  "Study like say lecturer dey watch you. 👀",
  "Your notes are calling. Pick up. 📝",
  "Go and read. Glory no dey find lazy people. 🏆",
  "Open that book and behave like a serious person. 😭",
  "No more vibes. It is time to read. 📚",
  "Read now or explain later. 💀",
  "Let the book know you still care. ✍️",
  "Prof no dey smile. Study well. 😀",
  "Go learn something before the semester finishes you. 😵‍💫",
  "Read today. Regret less tomorrow. 📖",
  "Book first. Broke mentality later. 💼",
  "Study well. Your result dey your hand. 😭",
  "Open book. Enter brain. Repeat. 🧠",
  "Go and read. The exam is already outside. 🚶‍♂️",
  "No shortcuts. Just notes and prayers. 🙏📚",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemeBanner() {
  const order = useMemo(() => shuffle(MEMES), []);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % order.length);
        setVisible(true);
      }, 250);
    }, 4500);
    return () => clearInterval(id);
  }, [order.length]);

  return (
    <div className="crop-marks bg-blueprint-light/30 border border-blueprint-line rounded-sm px-4 py-3 min-h-[52px] flex items-center">
      <p
        className={`text-sm text-paper/80 transition-opacity duration-250 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {order[index]}
      </p>
    </div>
  );
}
