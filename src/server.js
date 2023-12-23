const express = require('express');
const bodyParser = require('body-parser');
const { loginUser } = require('../requests/login');
const { registerUser } = require('../requests/register');

const app = express();

app.use(bodyParser.json());

app.post('/postEndpoint', (req, res) => {
  console.log('Received POST request with data:', req.body);

  res.send('POST request received');
});

app.post('/login', loginUser);
app.post('/register', registerUser);

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});