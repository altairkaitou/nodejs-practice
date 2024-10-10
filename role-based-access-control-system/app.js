const express = require('express');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;
console.log(SECRET_KEY);

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'DeadB0944922049!',
    database: 'auth_db'
});

db.connect((err) => {
    if (err) {
        console.error("Error Connecting to MySQL:", err.message);
    } else {
        console.log("Connected to MySQL Database");
    }
})

app.post('/users', async(req, res) => {
    const {username, email, password, role} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    //Insert the new user into Database

    db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role],
        (err, result) => {
            if (err) return res.status(500).json({error: 'Database Error'});
            res.status(201).json({message: 'User created successfully', userId: result.insertId})
        }
    )
});

//Login POST /login to generate JsonWebToken

app.post('/login', (req, res) => {
    const {email, password} = req.body;

    //Find user by email

    db.query('SELECT * FROM users WHERE email = ?', [email], async(err, result) => {
        if (err) return res.status(500).json({error: 'Database Error'});
        if (result.length === 0) return res.status(400).json({error: 'Invalid credentials'});

        const user = result[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({error: "Invalid Password"});

        //Generate JWT
        const token = jwt.sign({userId: user.id, role: user.role}, SECRET_KEY, {expiresIn: '1h'});
        res.status(200).json({message: "Login Successfully", token});
    } )
})


// Middleware to verify JWT and role
const verifytoken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({error: "Access Denined"});

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({error: "Invalid token"});
        req.user = user;
        next();
    })

}

//Middleware to check user roles

const checkrole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({error: 'Access Forbidden: insufficient role'});
        }

        next();
    }
}


// Admin route (GET /admin) - only Admin can access
app.get('/admin', verifytoken, checkrole(['Admin']), (req, res) => {
    res.status(200).json({message: 'Welcome Admin'});
} )


// Create Post Route for admin and Editor can access
app.post('/create-post', verifytoken, checkrole(['Admin', 'Editor']), (req, res) => {
    res.status(200).json({message: 'Post created successfully'});
});

app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
});


