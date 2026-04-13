export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Backgrounds ──
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-card": "var(--bg-card)",
        "bg-sidebar": "var(--bg-sidebar)",
        "bg-input": "var(--bg-input)",
        "bg-hover": "var(--bg-hover)",

        // ── Text ──
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-inverse": "var(--text-inverse)",

        // ── Accent ──
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-subtle": "var(--accent-subtle)",
        "accent-text": "var(--accent-text)",

        // ── Border ──
        border: "var(--border)",
        "border-strong": "var(--border-strong)",

        // ── Status ──
        "status-todo": "var(--status-todo)",
        "status-progress": "var(--status-progress)",
        "status-done": "var(--status-done)",

        // ── Priority ──
        "priority-urgent-bg": "var(--priority-urgent-bg)",
        "priority-urgent-text": "var(--priority-urgent-text)",
        "priority-high-bg": "var(--priority-high-bg)",
        "priority-high-text": "var(--priority-high-text)",
        "priority-medium-bg": "var(--priority-medium-bg)",
        "priority-medium-text": "var(--priority-medium-text)",
        "priority-low-bg": "var(--priority-low-bg)",
        "priority-low-text": "var(--priority-low-text)",
      },
    },
  },
  plugins: [],
};
