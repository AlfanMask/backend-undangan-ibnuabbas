"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// initialize express app and middlewares
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// create db
const db = new sqlite3_1.default.Database(path_1.default.join(__dirname, "db.sqlite"));
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS rsvp (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, message TEXT, confirmation TEXT)");
});
// routes
app.get("/rsvps", (req, res) => {
    db.all("SELECT * FROM rsvp ORDER BY id DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
app.post("/rsvp", (req, res) => {
    const { name, message, confirmation } = req.body;
    db.run("INSERT INTO rsvp (name, message, confirmation) VALUES (?, ?, ?)", [name, message, confirmation], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name, message, confirmation });
    });
});
app.delete("/rsvps", (req, res) => {
    db.run("DELETE FROM rsvp", (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        res.json({ message: "All RSVPs have been deleted" });
    });
});
// server static files from the frontend
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// start server
app.listen(3000, () => {
    console.log("Server is running");
});
