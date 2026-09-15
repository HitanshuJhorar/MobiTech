# Mobitech

A premium mobile-accessories e-commerce website.

## Tech Stack

- **Frontend**: Vite, React 19, TypeScript, Tailwind CSS v4, React Router v7, Axios, TanStack Query, Zustand, Lucide React, Zod
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, Helmet, CORS, Cookie-Parser, Dotenv, Zod
- **Tooling**: ESLint, Prettier, Concurrently, tsx

## Requirements

- Node.js (v18 or higher; tested on v24.x)
- npm (v9 or higher)
- MongoDB instance (optional during Phase 0)

## Installation

Install dependencies across the root, client, and server:

```bash
npm run install:all
```

## Environment Setup

Create local environment files if needed:

```bash
# Server (.env in /server or root)
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/mobitech

# Client (.env in /client)
VITE_API_URL=http://localhost:5000/api
```

See `.env.example` for the complete list of environment variables.

## Development Commands

- `npm run dev` — Run client and server concurrently
- `npm run dev:client` — Start Vite frontend dev server
- `npm run dev:server` — Start Express backend dev server
- `npm run build` — Build both backend and frontend for production
- `npm run build:client` — Build frontend only
- `npm run build:server` — Build backend only
- `npm run lint` — Run ESLint across client and server
- `npm run format` — Format codebase with Prettier

## Folder Structure

```
mobitech/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── hooks/
│       ├── services/
│       ├── store/
│       ├── types/
│       ├── utils/
│       ├── lib/
│       ├── data/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       └── vite-env.d.ts
│
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       ├── types/
│       ├── utils/
│       ├── app.ts
│       └── server.ts
│
├── .gitignore
├── .env.example
├── README.md
├── package.json
└── PROJECT.md
```
