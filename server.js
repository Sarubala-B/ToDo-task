// server.js or app.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Adjust path if necessary
const userRoutes = require('./routes/signup'); // Import your routes
const app = express();

app.use(express.json());
app.use('/api', userRoutes);
app.use(cors());


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
