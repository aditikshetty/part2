const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/medicalHistory', { useNewUrlParser: true, useUnifiedTopology: true });

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
document.getElementById('fetchButton').addEventListener('click', async () => {
  try {
    const response = await fetch('https://your-api.com/data');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    document.getElementById('data-container').innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
document.getElementById('data-container').innerText = JSON.stringify(data, null, 2);

app.listen(3000, () => console.log('Server running on port 3000'));