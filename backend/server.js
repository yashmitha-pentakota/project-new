const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');  // For file handling
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON payloads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'newdb',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Secret key for JWT
const JWT_SECRET = 'hloooooo';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or Expired Token' });
    }
    req.user = user;  
    next();
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });


app.post('/create-course', authenticateToken, upload.fields([{ name: 'image' }, { name: 'video' }]), (req, res) => {
  const { name, startDate, endDate, duration, rating, mentor } = req.body;

  if (!name || !startDate || !endDate || !duration || !rating || !mentor) {
    return res.status(400).json({ message: 'All course fields are required.' });
  }

  // Get file paths (relative paths)
  const image = req.files['image'] ? req.files['image'][0].path : 'C:\\Users\\akrivia\\Desktop\\projectnew\\task1\\backend\\uploads';
  const video = req.files['video'] ? req.files['video'][0].path : 'C:\\Users\\akrivia\\Desktop\\projectnew\\task1\\backend\\uploads';
console.log(video, image)

  const query = 'INSERT INTO courses (name, image, video, startDate, endDate, duration, rating, mentor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, image, video, startDate, endDate, duration, rating, mentor], (err) => {
    if (err) return res.status(500).send(err);

    res.status(200).json({ message: 'Course Created Successfully' });
  });
});

 
// Register Endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body; //its a json obj  { " ":" " , "":"",}
 
 
  const checkuserquery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkuserquery, [email], async (err, results) => {
    if (err) return res.status(500).send(err);
 
    if (results.length > 0) { //1/2/3 -no of rows matching
      return res.status(400).json({ message: 'Email already exists' });
    }
 
    // Hash password before saving to database
    try {
      const hashedPassword = await bcrypt.hash(password, 10); 
      const insertquery = 'INSERT INTO users(name, email, password) VALUES(?,?,?)';
      db.query(insertquery, [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).send(err);
 
 
        // Generate JWT token ,JWT_SECRET is the secret key used to sign the token
        const token = jwt.sign({ email, name }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
 
        res.status(200).json({ message: 'User Registered Successfully', token });
      });
    } catch (error) {
      return res.status(500).send('Error hashing password');
    }
  });
});
 
// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
 
  const loginQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(loginQuery, [email], async (err, results) => {
    if (err) return res.status(500).send(err);
 
    if (results.length > 0) {
      const user = results[0]; //results array will contain the rows returned by the database.
 
      // Compare password with hashed password
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          // Generate JWT token
          const token = jwt.sign({ email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
 
          res.status(200).json({ message: 'Login Successful', token });
        } else {
          res.status(400).json({ message: 'Invalid Credentials' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error comparing password' });
      }
    } else {
      res.status(400).json({ message: 'Invalid Credentials' });
    }
  });
});
 
// Fetch Courses Endpoint (No Authentication Needed)
app.get('/courses', (req, res) => {
  const query = 'SELECT * FROM courses';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    res.status(200).json(results);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
