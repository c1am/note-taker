const express = require("express");
const path = require("path");
const store = require("./db/STORE");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
var noteDB = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3000;


// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static
app.use(express.static("public"));

    // API ROUTES // (save/rewrite and load)

    // Get API notes
    app.get("/api/notes", (req,res) => {
        res.json(noteDB)
    });

    // Post API notes
    app.post("/api/notes", (req, res) => {
        req.body.id = uuidv4();
        const newNote = req.body;

        noteDB.push(newNote);

        fs.writeFileSync("./db/db.json", JSON.stringify(noteDB));
        res.json(noteDB);
    });

    // Delete note
    app.delete("/api/notes/:id", (req, res) => {
        const id = req.params.id;

        noteDB = noteDB.filter(notes => notes.id != id);

        fs.writeFileSync("./db/db.json", JSON.stringify(noteDB));
        res.json(store.read())
    });

// HTML routes
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "public/notes.html")));
app.get("*", (req, res) => res.send("404"));

// Start listening
app.listen(PORT, () => console.log("server running on http://localhost:3000"));
