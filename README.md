Collaborative Task Planner

This project is a web application designed to make planning tasks with friends or teammates simple and effective. It goes beyond a basic to-do list by allowing users to create and track tasks, set deadlines, sync with calendars, and collaborate in real time with shared notes and whiteboards.

I built this project to practice full-stack development and learn how to integrate features that are commonly used in real-world software: databases, real-time communication, and external APIs.

Features

Create, update, and complete tasks with due dates and priorities

Sync tasks with Google Calendar for reminders and scheduling

Real-time collaboration with WebSockets (instant updates across users)

Shared whiteboard/notes board for brainstorming with teammates

Simple and clean user interface built with React

Tech Stack

Frontend: React, React Router, Webpack

Backend: Node.js, Express, Socket.IO

Database: PostgreSQL

Other: Google Calendar API, Firebase/WebRTC (for collaborative notes)

Getting Started
1. Clone the repository
git clone https://github.com/AnishPatel526/collaborative-task-planner.git
cd collaborative-task-planner

2. Backend setup
cd backend
npm install
cp .env.example .env   # add your Postgres + Google API keys
npm start

3. Database setup

Run the schema:

psql -d your_database -f database/schema.sql

4. Frontend setup
cd ../frontend
npm install
npm start


The frontend will run on http://localhost:3000
.

Next Steps

Deploy backend (Heroku/Render) and frontend (Vercel/Netlify)

Add task categories and recurring tasks

Improve UI with drag-and-drop task management

About

Created by Anish Patel, Computer Science and Statistics student at UNC Chapel Hill, interested in building tools that make everyday collaboration more efficient.
