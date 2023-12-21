const express = require('express');
const bodyParser = require('body-parser');
const { loginUser } = require('../requests/login');

const app = express();

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

app.post('/postEndpoint', (req, res) => {
  // Access the posted data from req.body
  console.log('Received POST request with data:', req.body);

  // Send a response
  res.send('POST request received');
});

app.post('/login', loginUser);

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});