/**
 * server.js
 * -----------------------------------------------------------------------
 * A minimal Express.js backend implementing a Signup + Login system.
 *
 * Per the requirements, the API layer exposes ONLY the POST HTTP method:
 *   - POST /api/signup
 *   - POST /api/login
 *
 * (Static HTML/CSS/JS files are served via express.static, which is just
 * the browser fetching page assets — not part of the "API". The actual
 * data-facing API routes below are POST-only.)
 * -----------------------------------------------------------------------
 */

const express = require("express");
const path = require("path");
const { users, getNextId } = require("./users");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies (so req.body works for our POST routes)
app.use(express.json());

// Serve the frontend (signup.html, login.html, home.html, etc.)
app.use(express.static(path.join(__dirname, "public")));

/**
 * POST /api/signup
 * Body: { email, username, password }
 *
 * - 400 -> if any field is missing/empty
 * - 409 -> if a user with that username already exists
 * - 201 -> on successful creation, returns the created user (minus password)
 */
app.post("/api/signup", (req, res) => {
  const { email, username, password } = req.body || {};

  // --- Validation: reject empty fields ---
  if (!email || !email.trim() || !username || !username.trim() || !password || !password.trim()) {
    return res.status(400).json({ message: "Email, username, and password are all required." });
  }

  // --- Check for existing user (by username) ---
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(409).json({ message: `Username "${username}" is already taken.` });
  }

  // --- Create and store the new user ---
  const newUser = {
    id: getNextId(),
    email: email.trim(),
    username: username.trim(),
    password: password, // NOTE: plaintext for demo purposes only. Never do this in production.
  };
  users.push(newUser);

  // Don't send the password back, even in a demo.
  const { password: _pw, ...safeUser } = newUser;
  return res.status(201).json({ message: "Account created successfully.", user: safeUser });
});

/**
 * POST /api/login
 * Body: { username, password }
 *
 * - 400 -> if any field is missing/empty
 * - 404 -> if no user matches that username
 * - 401 -> if username exists but password is wrong
 * - 200 -> if credentials match
 */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};

  // --- Validation: reject empty fields ---
  if (!username || !username.trim() || !password || !password.trim()) {
    return res.status(400).json({ message: "Username and password are both required." });
  }

  // --- Look up the user ---
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "No account found with that username." });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password." });
  }

  const { password: _pw, ...safeUser } = user;
  return res.status(200).json({ message: "Login successful.", user: safeUser });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
