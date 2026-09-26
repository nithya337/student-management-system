const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("Connected to MySQL!");
});

app.get("/", (req, res) => {
    res.send("Backend server is running!");
});

app.get("/students", (req, res) => {
    const sql = "SELECT * FROM students";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching students:", err);
            return res.status(500).json({
                error: "Failed to fetch students"
            });
        }

        res.json(results);
    });
});


app.post("/students", (req, res) => {
    const { name, email, age } = req.body;

    // Validation
    if (!name || !email || !age) {
        return res.status(400).json({
            error: "Name, email and age are required"
        });
    }

    const sql = `
        INSERT INTO students (name, email, age)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, email, age], (err, result) => {
        if (err) {
            console.error("Error adding student:", err);
            return res.status(500).json({
                error: "Failed to add student"
            });
        }

        res.status(201).json({
            message: "Student added successfully",
            studentId: result.insertId
        });
    });
});
app.put("/students/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    // Validation
    if (!name || !email || !age) {
        return res.status(400).json({
            error: "Name, email and age are required"
        });
    }

    const sql = `
        UPDATE students
        SET name = ?, email = ?, age = ?
        WHERE id = ?
    `;

    db.query(sql, [name, email, age, id], (err, result) => {
        if (err) {
            console.error("Error updating student:", err);
            return res.status(500).json({
                error: "Failed to update student"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully"
        });
    });
});
app.delete("/students/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting student:", err);
            return res.status(500).json({
                error: "Failed to delete student"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    });
});
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});