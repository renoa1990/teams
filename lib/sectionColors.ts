export const sectionTone = {
  date: { main: "#4b5563", bg: "#f8fafc", border: "#e2e8f0" },
  locked: { main: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  balance: { main: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  solution: { main: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe" },
  holdings: { main: "#0f766e", bg: "#f0fdfa", border: "#99f6e4" },
  withdraw: { main: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
  deposit: { main: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  total: { main: "#1e3a8a", bg: "#dbeafe", border: "#93c5fd" },
  yesterday: { main: "#334155", bg: "#f1f5f9", border: "#cbd5e1" },
  margin: { main: "#0f172a", bg: "#f8fafc", border: "#e2e8f0" },
} as const;

export type SectionTone = (typeof sectionTone)[keyof typeof sectionTone];
