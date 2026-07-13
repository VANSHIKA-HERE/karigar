# Karigar Setup Guide

## Workspaces

The project uses an npm workspace monorepo:

- `frontend/` — Next.js App Router app
- `backend/` — Express + TypeScript API

## Dependencies

### Frontend

Core dependencies:
- `next`
- `react`
- `react-dom`
- `framer-motion`
- `clsx`
- `tailwind-merge`
- `class-variance-authority`
- `lucide-react`

Dev dependencies:
- `typescript`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `eslint`
- `eslint-config-next`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-jsx-a11y`
- `eslint-plugin-tailwindcss`
- `prettier`

### Backend

Core dependencies:
- `express`
- `mongoose`
- `dotenv`
- `cors`
- `helmet`
- `morgan`
- `cookie-parser`
- `express-async-errors`
- `jsonwebtoken`
- `bcrypt`
- `passport`
- `passport-google-oauth20`
- `socket.io`
- `cloudinary`
- `razorpay`
- `@googlemaps/google-maps-services-js`
- `compression`
- `zod`

Dev dependencies:
- `typescript`
- `ts-node-dev`
- `eslint`
- `eslint-config-prettier`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`
- `prettier`
- `@types/express`
- `@types/node`
- `@types/cors`
- `@types/cookie-parser`
- `@types/morgan`
- `@types/jsonwebtoken`
- `@types/bcrypt`
- `@types/passport-google-oauth20`
- `@types/socket.io`
- `@types/helmet`

## Install commands

From the workspace root:

```bash
npm install
```

To install only frontend dependencies:

```bash
cd frontend
npm install
```

To install only backend dependencies:

```bash
cd backend
npm install
```

## Common workspace scripts

- `npm run dev` — start frontend and backend concurrently
- `npm run build` — build both workspaces
- `npm run lint` — lint both workspaces
- `npm run format` — format code in the monorepo
