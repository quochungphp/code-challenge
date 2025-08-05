# Real-Time Scoreboard Backend Module

## 📘 Overview

This module provides real-time score updates for an online game scoreboard. It allows users to submit scores via an authenticated WebSocket connection and receive instant updates across all clients. Redis is used for session caching and Pub/Sub messaging, ensuring fast and synchronized UI updates.

## 🏗️ Architecture

### Tech Stack

- **Backend**: Node.js with Socket.IO
- **WebSocket Auth**: JWT middleware
- **Cache & PubSub**: Redis with Socket.IO Redis Adapter
- **Database**: Relational (e.g., PostgreSQL)
- **Frontend**: React (assumed)

### Component Interaction

- **Frontend Web App** authenticates via REST, stores the JWT locally.
- **WebSocket** connection is upgraded and authenticated via JWT.
- **Game Board** is joined via WS events, updating the UI in real time using Redis PubSub to broadcast score changes.
- **Redis** stores session state and caches leaderboard results.

![Flow Diagram]![alt text](<Screenshot 2025-08-05 at 9.26.36 PM.png>)

---

## 🔄 Flow Summary

1. User logs in → receives JWT token.
2. JWT is stored locally and reused for WebSocket authentication.
3. Socket.IO server validates JWT via middleware.
4. Users join a specific game board (room).
5. Score submission is sent via `ws:submitScore` event.
6. Backend validates if the score is already submitted.
7. If valid:
    - Updates DB
    - Updates Redis cache
    - Broadcasts updated scores via Redis PubSub to all users in the same room.
8. Clients receive updated leaderboard data in real time and re-render UI.

---

## 🔐 Security

- **JWT Auth Middleware** ensures that only authenticated users can connect to the WebSocket and submit scores.
- Each score submission is validated to prevent replay attacks or duplicate submissions.
- Redis stores per-user session states to prevent malicious behavior.
- Backend rejects any score updates without a valid session and JWT.

---

## 🔧 WebSocket Events

### Client → Server

- `ws:joinBoard`
  - Payload: `{ boardId: string }`
  - Action: Joins the user to the specified game board room.

- `ws:submitScore`
  - Payload: `{ boardId: string, score: number }`
  - Action: Triggers score validation and update flow.

### Server → Client

- `ws:boardUpdated`
  - Payload: `{ users: [{ userId, score, rank }] }`
  - Sent to all users on the board when a new score is submitted.

- `ws:submissionResult`
  - Payload: `{ status: 'ok' | 'error', message?: string }`
  - Sent back to the user who submitted a score.

---

## 🧪 API Endpoint

- `POST /auth/login`
  - Body: `{ userName, password }`
  - Response: `{ accessToken: JWT }`

Other interactions are handled through WebSocket events.

---

## ⚙️ Caching Strategy

- **Redis** is used to cache:
  - Active user sessions
  - Game board leaderboards
- Cache is updated in sync with the database after a valid score submission.
- Cache invalidation strategy: TTL or explicit cache update after each write.

---

## 📈 Leaderboard Sorting Logic

```sql
ORDER BY score DESC, submittedAt ASC
LIMIT 10
