const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const mysql = require('mysql2');

app.use(express.json());

const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET;


//MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'DeadB0944922049!',
    database: 'auth_db'
});


db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});


//Register Route

app.post('/register', async(req, res) => {
    const {username, email, password} = req.body;

    //Check if user exists
    db.query('SELECT * FROM users where email = ?', [email], async(err,result) => {
        if (err) return res.status(500).json({error: "Database Error"});
        if (result.length > 0 ) return res.status(400).json({error: "Email already exists"});

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 - Normal Salt Round

        //Insert new user into database

        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword], (err, result) => {
                if (err) return res.status(500).json({error: "Database error"});
                res.status(201).json({message: "User registered successfully"});
            }
        )
    })
})


app.post('/login', (req, res) => {
    const {email, password} = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async(err, result) => {
        if (err) return res.status(500).json({error: "Database Error"});
        if (result.length == 0) return res.status(400).json({error: "The field of email should not empty"});

        const user = result[0];

        //Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({error: "Invalid credentials"});

        //Generate JWT Token
        const token = jwt.token({userId: user.id, email: user.email}, SECRET_KEY, {expireIn: '1h'});
        res.status(200).json({message: 'Logged in Successfully', token})
    })
})


//Protected Route

app.get('/profile', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({error: "Access Denined"});
    //Verify Token

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({error: "Invalid token"});

        res.status(200).json({message: "Protected profile data", user});
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})