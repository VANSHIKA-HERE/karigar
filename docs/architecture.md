# Karigar Architecture

This document describes the initial folder structure and the purpose of each folder.

## Root structure

- `frontend/` — The client-side application built with Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.
- `backend/` — The server-side application built with Node.js, Express, and MongoDB/Mongoose.
- `docs/` — Architecture documentation and decisions.

## Frontend

- `frontend/app/` — Next.js App Router entry points and page routing.
- `frontend/components/` — Shared UI components used across features.
- `frontend/features/` — Feature modules organized by domain (auth, workers, bookings, payments, etc.).
- `frontend/hooks/` — Custom React hooks for shared logic and state.
- `frontend/lib/` — Reusable libraries and service wrappers (API clients, formatters, helpers).
- `frontend/config/` — Client-side configuration, constants, and environment helpers.
- `frontend/context/` — React context providers for auth, app state, and feature state.
- `frontend/styles/` — Global styles, design tokens, and Tailwind configuration entrypoints.
- `frontend/public/` — Static assets such as images, icons, and manifest files.
- `frontend/types/` — Shared TypeScript types and interfaces used by the frontend.
- `frontend/tests/` — Frontend test suites and utilities.

## Backend

- `backend/src/config/` — Environment and configuration loading.
- `backend/src/controllers/` — Request handlers that orchestrate use cases.
- `backend/src/routes/` — Express route definitions.
- `backend/src/services/` — Business logic and use case coordination.
- `backend/src/repositories/` — Data access layer and MongoDB abstractions.
- `backend/src/models/` — Mongoose model definitions.
- `backend/src/middlewares/` — Express middleware for auth, validation, logging, error handling.
- `backend/src/infrastructure/` — Infrastructure-specific integrations.
  - `database/` — MongoDB connection and persistence utilities.
  - `cloudinary/` — Cloudinary upload and asset management wrappers.
  - `payments/` — Razorpay integration and payment helpers.
  - `socket/` — Socket.io server and real-time event handling.
  - `maps/` — Google Maps and geolocation integration helpers.
- `backend/src/domain/` — Clean architecture domain layer.
  - `entities/` — Business entities and domain models.
  - `use-cases/` — Application use cases and service orchestration.
  - `value-objects/` — Domain value objects and validation logic.
- `backend/src/adapters/` — Ports and adapter implementations for external services.
- `backend/src/utils/` — Shared utilities and helpers.
- `backend/src/validators/` — Validation schemas and request validation logic.
- `backend/src/types/` — Shared TypeScript types and interfaces for the backend.
- `backend/tests/` — Backend test suites.
- `backend/scripts/` — Project automation scripts and setup helpers.

## Notes

- The structure is intentionally separated to support independent deploys and scalability.
- Feature-based frontend structure supports modular growth and reuse.
- Clean backend architecture reduces coupling and makes the platform easier to maintain.
