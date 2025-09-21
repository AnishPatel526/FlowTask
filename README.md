
# FlowTask (Collaborative Task Planner)

Collaborative Task Planner is a web application designed to make planning tasks with friends or teammates easy and effective. It goes beyond a simple to-do list by allowing users to create and track tasks, set deadlines, sync with calendars, and collaborate in real time with shared notes and whiteboards.

I built this project to practice full-stack development and learn how to incorporate features commonly used in real-world software, such as databases, real-time communication, and external APIs. The refreshed UI keeps things lightweight while adding a couple of "nice to have" touches you might expect from a sophomore/junior-level project: dark mode, task filters, real-time progress stats, and an upgraded whiteboard for quick collaboration.

## Highlights

- **Task dashboard**: add tasks with rich descriptions and due dates, then filter, search, and sort them automatically.
- **Smarter status view**: progress bar, overdue counts, and a "next up" callout that surfaces the closest deadline.
- **Live collaboration**: Socket.IO keeps tasks and the canvas in sync for everyone connected.
- **Theme toggle**: remembers your light/dark preference and adapts to system defaults.
- **Upgraded whiteboard**: adjustable pen size, quick color palette, and one-click board clear.
- **Straightforward stack**: React + Express + PostgreSQL, with real-time events via Socket.IO.
- **Extensible integrations**: REST API endpoints and a Google Calendar stub ready for future sync.

> Want to experiment with calendar sync or persistent whiteboard notes? Check out `backend/google.js` and `backend/routes/notes.js` for stubs you can extend when you have more time.

## Project structure

- `frontend` - React SPA using React Router and `socket.io-client`. Custom styling lives in `frontend/styles.css`.
- `backend` - Express server with REST routes, Socket.IO, and PostgreSQL access through `pg`.

## Running locally

1. **Install dependencies**:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. **Set up the database**:

   Create a PostgreSQL database and run the SQL in `backend/database/schema.sql`. Then copy `.env.example` to `.env` and fill in your connection URL. The server looks for `DATABASE_URL` and `GOOGLE_CLIENT_SECRET` variables.

3. **Start the backend server**:

   ```bash
   cd backend
   npm start
   ```

   The server will run on `http://localhost:5000` by default.

4. **Start the frontend development server**:

   ```bash
   cd frontend
   npm start
   ```

   This will run the React app on `http://localhost:3000`.

## Deployment

Deploy the backend to your preferred Node host (Render, Railway, Fly.io, etc.) and point it at a managed PostgreSQL instance. Use `npm install` for the build command and `npm start` for the run command. Remember to copy the environment variables from `.env`.

For the frontend, run `npm run build` and serve the compiled assets from a static host such as Vercel, Netlify, or an S3 bucket behind a CDN.

## Next steps

- Hook up `backend/google.js` to the Google Calendar API to push deadlines automatically.
- Persist whiteboard snapshots so teams can revisit previous drawings.
- Add authentication if you plan to run this outside of trusted teammates.

**ENJOY!!!!**
