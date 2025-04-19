const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../../data/restarts.db'));

const initializeDatabase = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS restart_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        container_id TEXT NOT NULL,
        container_name TEXT NOT NULL,
        action TEXT NOT NULL,
        timestamp DATETIME NOT NULL
      )
    `);
  });
};

const logRestart = (log) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO restart_logs (container_id, container_name, action, timestamp) VALUES (?, ?, ?, ?)',
      [log.containerId, log.containerName, log.action, log.timestamp],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

const getRestartLogs = () => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM restart_logs ORDER BY timestamp DESC LIMIT 100',
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

module.exports = {
  initializeDatabase,
  logRestart,
  getRestartLogs
}; 