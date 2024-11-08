// server.js or app.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Adjust path if necessary
const userRoutes = require('./routes/signup'); // Import your routes
const app = express();

// Use CORS middleware to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
}));
app.use(express.json());
app.use('/api', userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
