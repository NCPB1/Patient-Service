const express = require('express');
const serverless = require('serverless-http'); // Enables Express app to work with AWS Lambda

const app = express();
app.use((req, res, next) => {
  console.log('Raw body:', req.body); // This may log 'undefined' if JSON parsing fails
  next();
});


// Middleware to handle JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.type === 'entity.parse.failed' && err.status === 400) {
    console.error('JSON Parsing Error:', err.message); // Log error for debugging
    return res.status(400).json({
      error: 'Invalid JSON payload',
      details: err.message,
    });
  }
  next();
});

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with your domain for production
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self';");
  next();
});


// In-memory data store (replace with a database in a real application)
let patients = [
  { id: '1', name: 'John Doe', age: 30, condition: 'Healthy' },
  { id: '2', name: 'Jane Smith', age: 45, condition: 'Hypertension' },
];

// Health check endpoint
app.get('/Service/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Patient Service' });
});

// Get all patients (for /service/patients)
app.get('/Service/patients', (req, res) => {
  res.json({
    message: 'Patients retrieved successfully',
    count: patients.length,
    patients: patients,
  });
});

// Get a patient by ID (for /service/patients/{id})
app.get('/Service/patients/:id', (req, res) => {
  const patient = patients.find((p) => p.id === req.params.id);
  if (patient) {
    res.json({
      message: 'Patient found',
      patient: patient,
    });
  } else {
    res.status(404).json({ error: 'Patient not found' });
  }
});

// Add a new patient (for /service/patients)
app.post('/Service/patients', (req, res) => {
  try {
    const { name, age, condition } = req.body;
    if (!name || !age) {
      return res.status(400).json({ error: 'Name and age are required' });
    }
    const newPatient = {
      id: (patients.length + 1).toString(),
      name,
      age,
      condition: condition || 'Not specified',
    };
    patients.push(newPatient);
    res.status(201).json({
      message: 'Patient added successfully',
      patient: newPatient,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the app as a Lambda-compatible handler
module.exports.handler = serverless(app);

