const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/medicalHistory', { useNewUrlParser: true, useUnifiedTopology: true });
// ...existing code...
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(express.json()); // Middleware for JSON parsing
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);
// ...existing code...
const visitSchema = new mongoose.Schema({
    doctor_name: String,
    date: String,
    notes: String
});

const medicationSchema = new mongoose.Schema({
    name: String,
    dosage: String,
    date: String
});

const testSchema = new mongoose.Schema({
    test_name: String,
    date: String,
    file_path: String
});

const Visit = mongoose.model('Visit', visitSchema);
const Medication = mongoose.model('Medication', medicationSchema);
const Test = mongoose.model('Test', testSchema);

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/log_visit', async (req, res) => {
    try {
        const visit = new Visit(req.body);
        await visit.save();
        res.json({ message: "Doctor visit logged successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/add_medication', async (req, res) => {
    try {
        const medication = new Medication(req.body);
        await medication.save();
        res.json({ message: "Medication added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/upload_test', upload.single('file'), async (req, res) => {
    try {
        const test = new Test({
            test_name: req.body.test_name,
            date: req.body.date,
            file_path: req.file.path
        });
        await test.save();
        res.json({ message: "Test uploaded successfully!", file_path: req.file.path });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));