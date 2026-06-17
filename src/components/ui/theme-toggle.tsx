"use client"

import { useEffect } from "react"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  useEffect(() => {
    document.documentElement.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }, []);

  return null;
}

