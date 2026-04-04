# FlowForge Frontend

> React frontend for FlowForge — a team task management platform with kanban boards, threaded comments, role-based access, and a fully token-based light/dark theme system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Vite) |
| State Management | Redux Toolkit |
| API Layer | RTK Query |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Theme | CSS Variables + Token System |

---

## Features

- **Kanban boards** — drag and drop tasks across status columns
- **Organizations** — multi-org support with role-based access control
- **Role-based UI** — views and actions adapt based on org and board roles (`owner`, `admin`, `member`, `viewer`)
- **Task management** — create, assign, prioritize, and track tasks with due dates
- **Threaded comments** — nested comment threads on tasks
- **Activity log** — full audit trail per board and task
- **Invite system** — token-based email invite flow
- **Light / Dark mode** — fully token-based theme system, persists across sessions, respects OS preference
- **Responsive** — works across desktop and tablet

---

## Theme System

FlowForge uses a fully token-based theme system — no `dark:` utility classes anywhere in the codebase.

All colors are defined as CSS variables in `index.css`:

```css
:root {
  --bg-primary: #FAF7F2;   /* warm creamy base */
  --accent: #C97D4E;       /* terracotta */
}

.dark {
  --bg-primary: #0F1117;   /* deep navy */
  --accent: #7B8FFF;       /* electric indigo */
}
```

Mapped to Tailwind utilities in `tailwind.config.js`:

```js
colors: {
  "bg-primary": "var(--bg-primary)",
  "accent": "var(--accent)",
}
```

Used in components as single tokens:

```jsx
<div className="bg-bg-primary text-text-primary">
  <span className="text-accent">FlowForge</span>
</div>
```

Toggle is handled by `useTheme` hook — adds/removes `class="dark"` on `<html>` and persists to `localStorage`. Falls back to OS preference on first visit.

---

## Project Structure

```
src/
├── components/
│   └── ThemeToggle.jsx         # sun/moon toggle button
├── hooks/
│   └── useTheme.js             # theme toggle + localStorage
├── pages/                      # route-level page components
├── redux/
│   ├── store.js                # redux store — set once, never touched
│   ├── rootReducer.js          # add new slices here only
│   ├── services/
│   │   └── api.js              # base RTK Query API with token injection
│   └── modules/
│       ├── auth/
│       │   ├── authSlice.js    # user, token, isAuthenticated
│       │   └── authApi.js      # login, register, getMe, changePassword
│       ├── organization/
│       │   ├── organizationSlice.js
│       │   └── organizationApi.js
│       ├── board/
│       │   ├── boardSlice.js
│       │   └── boardApi.js
│       ├── task/
│       │   ├── taskSlice.js
│       │   └── taskApi.js
│       ├── status/
│       │   └── statusApi.js
│       ├── comment/
│       │   └── commentApi.js
│       └── invite/
│           └── inviteApi.js
├── App.jsx
├── index.css                   # CSS variable token definitions
└── main.jsx                    # theme init before React mounts
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- FlowForge backend running locally

### Installation

```bash
git clone https://github.com/snageshprasad/flow-forge-frontend.git
cd flow-forge-frontend
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run

```bash
# development
npm run dev

# production build
npm run build
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | FlowForge backend API base URL |

---

## Redux Architecture

All API modules extend a single `baseApi` using RTK Query's `injectEndpoints` pattern. This means:

- `store.js` — never modified after initial setup
- `api.js` — never modified after initial setup
- Adding a new API module → create `moduleApi.js` and call `baseApi.injectEndpoints()`
- Adding a new slice → only update `rootReducer.js`

JWT token is automatically injected into every request via `prepareHeaders` in `baseApi`.

---

## Color Tokens

| Token | Light | Dark | Usage |
|---|---|---|---|
| `bg-primary` | `#FAF7F2` | `#0F1117` | page background |
| `bg-card` | `#FFFFFF` | `#161924` | cards, panels |
| `accent` | `#C97D4E` | `#7B8FFF` | buttons, links, highlights |
| `text-primary` | `#3D2F22` | `#C8CCDF` | headings, body |
| `text-muted` | `#9E8F7E` | `#4A5068` | labels, placeholders |
| `priority-urgent` | red | muted red | urgent tasks |
| `priority-high` | orange | muted orange | high priority tasks |
| `priority-medium` | amber | muted amber | medium priority tasks |
| `priority-low` | green | muted green | low priority tasks |

---

## Backend

This frontend connects to the [FlowForge Backend](https://github.com/snageshprasad/flow-forge-backend).

---

## License

Copyright (c) 2025 Nagesh Prasad. All Rights Reserved.

This source code is publicly visible for portfolio and review purposes only.
Unauthorized use, copying, modification, distribution, or commercial use
of this code without explicit written permission from the author is strictly prohibited.