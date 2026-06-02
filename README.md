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

**Database seeding** — the task did not specify providing sample data, so the book collection is empty on first run.

## Running locally

Requirements: Docker with Compose.

```bash
git clone https://github.com/kStoko23/booktracker/
cd BookTracker
docker compose up -d --build
```

- API: `http://localhost:8080`
- Frontend: `http://localhost:5173`

## Handling large datasets

The task mentions up to 10 million records. A few decisions were made with that in mind:

- All list endpoints are paginated — no endpoint returns unbounded results
- Search on `title` and `author` fields is backed by database indexes
- A relational database was chosen over document-based solutions (e.g. Firebase) because the data model is structured and predictable, and relational databases handle indexed queries over large tables significantly better in this use case. PostgreSQL was chosen specifically for its maturity and performance at scale

## Loose ends

- No authentication or authorization
- No multi-user support
- Error handling returns stack traces in development mode — should be replaced with proper error middleware before any real deployment
- No integration tests, only basic validation logic is covered

## AI tools

Claude was used during development for assistance with Docker Compose configuration. All generated output was reviewed and tested manually before being included. Architecture decisions, data model and API design were done independently. Some UI styling was also done using Claude, to speed up development.
