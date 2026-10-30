# Chief Milan Kumar Modak Portfolio — Backend API

Backend service built with Node.js, Express, and MongoDB (Mongoose) for handling missives, messages, and hire-me inquiries from the Citadel Recruitment Outpost.

## Features
- **RESTful Endpoints**:
  - `POST /api/messages` or `POST /api/contact` — Dispatch a recruitment missive / contact form
  - `GET /api/messages` or `GET /api/contact` — View saved recruitment scrolls
  - `GET /api/messages/:id` — Inspect a single scroll
  - `PATCH /api/messages/:id/status` — Update status (`unread`, `read`, `archived`)
  - `DELETE /api/messages/:id` — Remove scroll
  - `GET /api/health` — Check server & MongoDB connection health status
- **Validation**: Name, email format, and message content checks.
- **CORS Enabled**: Configured for local dev (`http://localhost:5173`) and customizable through `CLIENT_URL`.
- **Mongoose Schema**: Stores name, email, role, orders/message, read status, and timestamps.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd Backend
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` if not already present:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/milan_portfolio
   CLIENT_URL=http://localhost:5173
   ```
   *Note: If using MongoDB Atlas, replace `MONGODB_URI` with your connection string:*
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/milan_portfolio?retryWrites=true&w=majority
   ```

3. **Start the Server**:
   - For development with auto-reload:
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```
