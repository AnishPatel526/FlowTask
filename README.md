# Collaborative Task Planner

This project is a web application designed to make planning tasks with friends or teammates easy and effective. It goes beyond a simple to-do list by allowing users to create and track tasks, set deadlines, sync with calendars, and collaborate in real time with shared notes and whiteboards.

I built this project to practice full-stack development and learn how to incorporate features commonly used in real-world software, such as databases, real-time communication, and external APIs.

## Features

* **Task management** – create, update, delete and reorder tasks. Each task has a title, description, due date, priority and completion status.
* **Real‑time updates** – when one user adds or updates a task, other connected clients are updated instantly via WebSockets.
* **Calendar integration** – optional Google Calendar sync so that task due dates appear on your calendar. See `backend/google.js` for placeholder code.
* **Collaborative notes/whiteboard** – a simple canvas that multiple users can draw on simultaneously. Built with the HTML5 `<canvas>` API and WebRTC data channels for peer‑to‑peer updates.
* **REST API** – the backend exposes RESTful endpoints to manage tasks and notes. See `backend/routes/`.

This repository contains two top‑level folders:

* `frontend` – a React application bootstrapped without Create React App. It uses functional components, React Router and the `socket.io-client` library for real‑time communication.
* `backend` – a Node.js application using Express. It connects to PostgreSQL via the `pg` library and uses `socket.io` for WebSocket communication. Database configuration is handled via environment variables. See `.env.example` for expected variables.

## Running Locally

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

The app can be deployed to services like Heroku, Render or Vercel. For example, to deploy the backend on Render:

1. Create a new **Web Service** on Render pointing to the `backend` folder.
2. Configure the build command as `npm install` and the start command as `npm start`.
3. Add the environment variables defined in `.env.example` in the Render dashboard.

For the frontend, you can deploy to Vercel by linking the `frontend` folder and using the default React build script.

## Contributing

If you'd like to extend this project, feel free to fork the repository and submit a pull request. Contributions that improve the architecture, add features (e.g. authentication, Slack notifications) or enhance the UI/UX are welcome!
