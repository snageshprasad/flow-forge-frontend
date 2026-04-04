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

---

## Features

- **Kanban boards** — drag and drop tasks across status columns
- **Organizations** — multi-org support with role-based access control
- **Role-based UI** — views and actions adapt based on org and board roles (`owner`, `admin`, `member`, `viewer`)
- **Task management** — create, assign, prioritize, and track tasks with due dates
- **Threaded comments** — nested comment threads on tasks
- **Activity log** — full audit trail per board and task
- **Invite system** — token-based email invite flow
- **Light / Dark mode** — token-based theme, persists across sessions, respects OS preference
- **Responsive** — works across desktop and tablet

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

## Backend

This frontend connects to the [FlowForge Backend](https://github.com/snageshprasad/flow-forge-backend).

---

## License

Copyright (c) 2025 Nagesh Prasad. All Rights Reserved.

This source code is publicly visible for portfolio and review purposes only.
Unauthorized use, copying, modification, distribution, or commercial use
of this code without explicit written permission from the author is strictly prohibited.
