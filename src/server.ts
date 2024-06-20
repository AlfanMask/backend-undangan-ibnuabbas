import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

// initialize express app and middlewares
const app = express();
app.use(bodyParser.json());
app.use(cors());

// create db
const db = new sqlite3.Database(path.join(__dirname, "db.sqlite"));
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS rsvp (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, message TEXT, confirmation TEXT)"
  );
});

// routes
app.get("/rsvps", (req: Request, res: Response) => {
  db.all("SELECT * FROM rsvp ORDER BY id DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post("/rsvp", (req: Request, res: Response) => {
  const { name, message, confirmation } = req.body;
  db.run(
    "INSERT INTO rsvp (name, message, confirmation) VALUES (?, ?, ?)",
    [name, message, confirmation],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, message, confirmation });
    }
  );
});

app.delete("/rsvps", (req: Request, res: Response) => {
  db.run("DELETE FROM rsvp", (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    res.json({ message: "All RSVPs have been deleted" });
  });
});

// server static files from the frontend
app.use(express.static(path.join(__dirname, "public")));

// start server
app.listen(3000, () => {
  console.log("Server is running");
});
