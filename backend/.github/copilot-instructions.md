# Copilot instructions for backend

## Big picture architecture
- Entry point is [index.ts](../index.ts): Express app + Socket.io server; routes are mounted under `/users`, `/auth`, `/pins`, `/comments`, `/boards`, `/images`, `/conversations`.
- Data layer uses Mongoose models in `models/` with refs (Pin↔User/Board, Comment↔Pin/User, Like/Save↔Pin/User, Follow↔User, Conversation↔Message).
- Auth uses JWT stored in an httpOnly cookie named `token` (see `controllers/auth.controller.ts`); `middleware/verifyToken.ts` attaches `req.userId`.
- Socket.io is initialized in [index.ts](../index.ts) and stored via `utils/socket.ts`; notifications and messages emit to per-user rooms.

## Project-specific patterns
- Routes are thin; controllers perform DB work and return `{ message, data }` JSON.
- File uploads use `express-fileupload`; image uploads expect `req.files.media` (see `controllers/image.controller.ts`).
- Notifications are created via `services/notificationService.ts` to both persist and emit socket events.
- Pagination for pins uses `cursor` query and a fixed `LIMIT = 21` in `controllers/pin.controller.ts`.

## Integrations & external deps
- ImageKit is the image storage/CDN. Uploads are done via `@imagekit/nodejs` and `imagekit` packages; image transforms are built in `utils/image.ts`.
- Image optimization uses `sharp` in `utils/image.ts` before upload.
- Socket auth expects `handshake.auth.token` or `Authorization` header (JWT) in [index.ts](../index.ts).

## Developer workflows
- Dev server: `pnpm dev` runs `node --watch --env-file=.env index.ts` (see [package.json](../package.json)).
- Database connection is in `db/connectDB.ts` and requires `MONGO_DB_URI`.
- Seed script exists at `utils/seed.ts` (manual run; no npm script defined).

## Environment variables used
- `PORT`, `CLIENT_URL`, `MONGO_DB_URI`, `JWT_SECRET`.
- ImageKit: `IK_PUBLIC_KEY`, `IK_PRIVATE_KEY`, `IK_URL_ENDPOINT`.
- Image limits: `MAX_IMAGE_BYTES`, `MAX_IMAGE_DIMENSION`.
- `NODE_ENV` affects cookie `secure` flag.

## Gotchas
- `notification.route.ts` has `router.patch("mark-read", ...)` without a leading slash.
- `controllers/image.controller.ts` currently logs `textOverlayUrl` and returns early without uploading updated images.
