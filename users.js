/**
 * users.js
 * -----------------------------------------------------------------------
 * This acts as our "demo database": a plain JSON array kept in memory.
 * Each user is keyed by an auto-incrementing `id` field, as required.
 *
 * NOTE: Because this is just an in-memory array, all data resets whenever
 * the server restarts. That's expected for a demo/learning project.
 * -----------------------------------------------------------------------
 */

const users = [
  // Example shape of a stored user record:
  // { id: 1, email: "jane@example.com", username: "janedoe", password: "hunter2" }
];

// Simple helper to generate the next id (1, 2, 3, ...)
let nextId = 1;
function getNextId() {
  return nextId++;
}

module.exports = { users, getNextId };
