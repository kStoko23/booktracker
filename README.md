# BookTracker

A full-stack application for tracking books. Built as a recruitment task.

## Tech stack

- **Backend:** ASP.NET Core (C#), minimal API
- **Database:** PostgreSQL
- **Frontend:** React, TypeScript

## Features

- Add a book with title, author, ISBN, number of pages and a 1-5 rating
- List books with pagination
- Search by title and author
- Input validation with error messages

## What was skipped

**User accounts and authentication** — the task did not require multi-user support and implementing auth within the time limit would have left less time for the core features. The app assumes a single user. Adding auth (e.g. JWT with ASP.NET Core Identity) would be a straightforward next step.

## Running locally

Requirements: 
  1. API:
       - Docker
       - Compose
  2. UI:
     - node
     - npm
    
Running API:

```bash
git clone <repo-url>
cd BookTracker/BookTracker.Api
docker compose up -d
```

The API will be available at `http://localhost:8080`.

For the frontend:

```bash
cd BookTracker/BookTracker.Ui
npm install
npm run dev
```

## Handling large datasets

The task mentions up to 10 million records. A few decisions were made with that in mind:

- All list endpoints are paginated — no endpoint returns unbounded results
- Search on `title` and `author` fields is backed by indexes in the database
- A relational database was chosen over document-based solutions (e.g. Firebase) because the data model is structured and predictable, and relational databases handle indexed queries over large tables significantly better in this use case. PostgreSQL was chosen specifically.

## Loose ends

- No authentication or authorization
- No multi-user support
- Error handling returns stack traces in development mode

## AI tools

Claude was used during development for assistance with Docker Compose configuration. All generated output was reviewed and tested manually before being included. Architecture decisions, data model and API design were done independently.
