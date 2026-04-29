# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Carebridge** is a community help and resource platform. Users can post help requests, volunteers can accept and complete them, and admins manage the platform. Real-time features (chat, notifications, emergency/broadcast alerts) are delivered via STOMP over WebSocket.

Stack: **React 19 + Vite** (frontend) | **Spring Boot 4.0.6 + Java 17** (backend) | **MySQL**

---

## Commands

### Backend

```bash
cd backend
mvn spring-boot:run          # Start dev server on :8080
mvn clean install            # Full build (produces jar)
mvn test                     # Run tests
```

Requires MySQL running on `localhost:3306` with a database named `community_help`. Default credentials: `root` / (empty password). Schema is auto-managed by Hibernate (`ddl-auto: update`).

### Frontend

```bash
cd frontend
pnpm install                 # Install dependencies
pnpm dev                     # Start Vite dev server on :5173
pnpm build                   # Production build → dist/
pnpm lint                    # ESLint
pnpm preview                 # Preview production build
```

The frontend proxies `/api` and `/ws` to `http://localhost:8080` via `vite.config.js`. Override the API base with `VITE_API_BASE_URL` env var.

---

## Architecture

### Backend (`com.carebridge`)

Classic layered architecture: `controller → service → repository → entity`.

| Layer | Location | Notes |
|---|---|---|
| Controllers | `controller/` | 8 REST controllers; `@PreAuthorize` for role checks |
| Services | `service/` | Business logic; inject `SimpMessagingTemplate` for WS pushes |
| Repositories | `repository/` | Spring Data JPA; 6 repos |
| Entities | `entity/` | 7 entities + 3 enums (`Role`, `RequestStatus`, `NotificationType`) |
| DTOs | `dto/request/`, `dto/response/` | All API I/O goes through DTOs — entities never serialized directly |
| Security | `security/` | `JwtService`, `JwtAuthenticationFilter`, `SecurityConfig` |
| WS Config | `config/WebSocketConfig.java` | STOMP broker; registers `/ws` endpoint |
| WS Auth | `config/WebSocketAuthInterceptor.java` | Reads JWT from STOMP CONNECT frame, sets principal |

**Exception handling:** `exception/GlobalExceptionHandler.java` is a `@RestControllerAdvice` that converts `ResourceNotFoundException`, `DuplicateResourceException`, and `BusinessException` into `ApiResponse` error payloads. `SecurityConfig` also overrides the default authenticationEntryPoint and accessDeniedHandler to return JSON (not HTML).

**Key wiring:** Every service that needs real-time delivery injects `SimpMessagingTemplate` and calls:
- `convertAndSendToUser(email, "/queue/messages", payload)` — targets one user
- `convertAndSend("/topic/broadcasts", payload)` — targets all subscribers

**Security:** HTTP layer permits `/api/auth/**` and `/ws/**` without auth. All other routes require a valid JWT. WebSocket auth is enforced at STOMP frame level by `WebSocketAuthInterceptor`, not by HTTP security.

**Roles:** `USER`, `VOLUNTEER`, `ADMIN`. Enforced at both route level and method level (`@PreAuthorize`).

### Frontend (`frontend/src/`)

| Area | Location | Notes |
|---|---|---|
| API clients | `api/` | `axiosInstance.js` (JWT interceptor + 401 redirect), `authApi.js`, `helpRequestApi.js`, `adminApi.js`, `messageApi.js`, `notificationApi.js`, `emergencyApi.js` |
| Auth state | `context/AuthContext.jsx` | Token in localStorage; exposes `user`, `token`, `isAuthenticated`, `loading`, `login`, `logout`, `checkAuth` |
| WebSocket | `context/WebSocketContext.jsx` | STOMP client; subscribes to 4 channels; exposes `broadcasts[]`, `emergencies[]`, `dismissBroadcast`, `dismissEmergency` |
| Routing | `routes/AppRoutes.jsx` | 12 named routes + redirects; uses `components/ProtectedRoute.jsx` with role checking |
| Layout shell | `layout/Layout.jsx` | Active layout used by `AppRoutes`. Duplicates in `components/Layout.jsx` and `components/layout/Layout.jsx` are unused. |
| Global alerts | `components/GlobalAlerts.jsx` | Fixed-position cards for broadcasts and emergencies; persist until dismissed |
| Notifications | `components/NotificationDropdown.jsx` | Bell icon with unread badge; invalidated by WS events |

**Provider order in `App.jsx`:**
```
QueryClientProvider → BrowserRouter → AuthProvider → WebSocketProvider → AppRoutes + GlobalAlerts
```
`WebSocketProvider` must be inside `AuthProvider` because it reads `token` and `isAuthenticated`.

**Data flow:** REST mutations trigger immediate query invalidation for the sender's view. The WebSocket push handles the receiver's view — the WS subscription calls `queryClient.invalidateQueries(...)` on incoming frames.

**Pages duplication note:** `AppRoutes` imports pages from the flat `pages/` directory (e.g., `pages/Dashboard.jsx`, `pages/admin/AdminDashboard.jsx`). Legacy subdirectory variants (`pages/dashboard/`, `pages/auth/`, `pages/requests/`) have been removed.

**Roles & routes:**
- Public: `/login`, `/register`
- Any authenticated: `/dashboard`, `/requests`, `/requests/:id`, `/my-requests`, `/chat`
- USER + ADMIN: `/requests/new`
- ADMIN only: `/admin`, `/admin/users`, `/admin/users/:id`, `/admin/broadcast`, `/admin/emergency`

### WebSocket channels

| Destination | Delivery | Purpose |
|---|---|---|
| `/user/queue/messages` | Per-user | Incoming chat messages |
| `/user/queue/notifications` | Per-user | System notifications |
| `/topic/broadcasts` | All clients | Admin broadcast announcements |
| `/topic/emergency` | All clients | Emergency alerts |

JWT is passed in the STOMP CONNECT frame header (`Authorization: Bearer …`) because the browser WebSocket API cannot set custom HTTP headers during the WS handshake.

### Database

9 entities with Hibernate auto-DDL. Key relationships:
- `HelpRequest` → `User` (createdBy, acceptedBy)
- `Message` → `User` (sender, recipient)
- `Notification` → `User`

`User` implements Spring Security's `UserDetails`; the `email` field is the username principal.

Notable entity fields not obvious from names:
- `EmergencyAlert` has a `priority` field (string, passed through from `EmergencyRequest` DTO)
- `Message` has a boolean `read` field (updated via `PUT /api/messages/{id}/read`)
- `Notification` has both a `title` and a `message` text field, plus a `type` enum (`NotificationType`: `INFO`, `SUCCESS`, `WARNING`, `EMERGENCY`)

---

## Conventions

- **DTOs only across the API boundary** — never return or accept entity objects in controllers.
- **Lombok everywhere** — `@Data`, `@Builder`, `@RequiredArgsConstructor` are standard on entities, DTOs, and services.
- **`ApiResponse<T>`** is the generic response wrapper used across controllers.
- **Frontend styling** — CSS Modules are not used; plain CSS files are co-located with components (e.g., `chat.css` next to `ChatPage.jsx`). Global variables live in `App.css`.
- **React Query keys** — follow the pattern `['resource-name', id?]`, e.g. `['conversation', userId]`, `['notif-count']`.
