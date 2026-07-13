"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        aria-label="Toggle theme"
      />
    );
  }

  const isDark = theme === "dark" || resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
