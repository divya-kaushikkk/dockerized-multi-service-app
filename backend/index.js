import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
  host: process.env.DB_HOST,       
  user: process.env.DB_USER,       
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME    
});
db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }

  console.log("MySQL connected");

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Table creation failed:", err);
    } else {
      console.log("messages table ready");
    }
  });
});


app.post("/message", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Message is required" });
  }

  db.query(
    "INSERT INTO messages (text) VALUES (?)",
    [text],
    (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        success: true,
        id: result.insertId,
        text
      });
    }
  );
});

// app.get("/message", (req, res) => {
//   db.query("SELECT * FROM messages ORDER BY id ASC", (err, rows) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(rows);
//   });
// });


app.get("/", (req, res) => {
  res.send("Hello world");
});


app.listen(8080, "0.0.0.0", () => {
  console.log("Server is listening on port 8080");
});
