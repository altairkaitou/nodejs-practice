const express = require("express");
const bcrypt = require("bcryptjs");

const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "DeadB0944922049!",
    database: "auth_db"
});

db.connect(err => {
    if (err) {
    console.error("Error connecting to MySQL ", err.message );
    } else {
        console.log("Connected to MySql Database");
    }
});

app.post("/users", async(req, res) => {
    const {username, email, password} = req.body;

    //Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    //Insert new user into Database

    db.query("INSERT INTO users (username, email, password) VALUES(?, ?, ?)", 
        [username, email, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).json({error: "Database Error"});
            res.status(201).json({message: "User created successfully", userId: result.insertId});
        }
    )
});

app.get("/users", (req, res) => {
    db.query('SELECT id, username, email FROM users', (err, results) => {
        if (err) return res.status(500).json({error: 'Database Error'});
        res.status(200).json(results);
    })
})

//GET an user by ID /users/:id

app.get("/users/:id", (req, res) => {
    const userId = req.params.id;
    db.query('SELECT id, username, email FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) return res.status(500).json({error: 'Database Error'});
        if (result.length == 0) return res.status(404).json({error: 'User not found'});
        res.status(200).json(result[0]);
    })

});


// Update a user by ID (PUT /users/:id)

app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const {username, email, password} = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    db.query(
        'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
        [username, email, hashedPassword, userId],
        (err, result) => {
            if (err) return res.status(500).json({error: 'Database Error'});
            if (result.affectedRows === 0) return res.status(404).json({error: 'user not found'});
            res.status(200).json({message: 'user updated successfully'});
        }
    )
})


// Delete a user by ID (DELETE '/users/:id)

app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query(
        'DELETE FROM users WHERE id = ?', [userId], (err, result) => {
            if (err) return res.status(500).json({error: 'Database Error'});
            if (result.affectedRows === 0) return res.status(404).json({error: 'User not found'});
            res.status(200).json({message: "User deleted successfully"});
        } 
    )
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})