# Bump Auth App

A simple User Signup and Login authentication system built with Express.js. The API layer exposes **only the `POST` HTTP method** — no `GET`, `PUT`, `PATCH`, or `DELETE` routes for the actual data operations.

## Features

- **Sign Up** — collects `email`, `username`, and `password`, stores the new user in an in-memory JSON array "database."
- **Sign In** — checks `username` and `password` against that same array. Credentials travel in the request **body**, never as query/URL params.
- Proper HTTP status codes and error messages for every case (see below).
- A small themed frontend ("Bump" the monster 👾) built with plain HTML/CSS/JS — no frameworks, no build step.

## Tech Stack

- **Backend:** Node.js, Express.js
- **"Database":** a plain JS array (`users.js`), kept in memory — resets on server restart. This is intentional for a demo/learning project; swap in a real database for production use.
- **Frontend:** vanilla HTML, CSS, and JavaScript (`fetch` API, no frameworks)

## Project Structure

```
auth-app/
├── server.js          # Express app: POST /api/signup, POST /api/login
├── users.js            # In-memory "database" (JSON array) + id generator
├── package.json
├── package-lock.json
└── public/
    ├── index.html        # Landing + Sign Up + Sign In (single-page)
    ├── style.css          # "Bump" monster theme
    ├── script.js           # Client-side validation + fetch() calls to the API
    └── home.html            # Real homepage shown after a successful signup/login
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)

### Installation

```bash
git clone <your-repo-url>
cd auth-app
npm install
```

### Running the app

```bash
npm start
```

You should see:

```
Server running at http://localhost:3000
```

Then open **http://localhost:3000/index.html** in your browser (not a `file://` path — the frontend calls the API using relative URLs, so it must be served by Express).

## API Reference

### `POST /api/signup`

**Body:**
```json
{
  "email": "jane@example.com",
  "username": "janedoe",
  "password": "hunter22"
}
```

| Status | Condition                          |
|--------|-------------------------------------|
| `201`  | Account created successfully        |
| `400`  | One or more fields are empty        |
| `409`  | Username is already taken           |

### `POST /api/login`

**Body:**
```json
{
  "username": "janedoe",
  "password": "hunter22"
}
```

| Status | Condition                            |
|--------|----------------------------------------|
| `200`  | Login successful                       |
| `400`  | One or more fields are empty            |
| `401`  | Username exists, password is wrong      |
| `404`  | No user found with that username        |

## Notes & Limitations

- Passwords are stored in **plaintext** in the in-memory array. This is fine for a demo/learning exercise but should **never** be done in production — use a library like `bcrypt` to hash passwords before storing them.
- Data is **not persisted** to disk or a real database; restarting the server clears all signed-up users.
- No sessions, cookies, or JWTs are issued on login — this project focuses on the signup/login validation flow itself, not full session management.

## License

This project was built for educational purposes as part of a course activity.
