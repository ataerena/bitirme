const express = require('express');
const bodyParser = require('body-parser');
const { loginUser } = require('../requests/login');
const { registerUser } = require('../requests/register');
const fileUploadRouter = require('../requests/fileUpload');
const { getImages } = require('../requests/getImages');

const app = express();

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Your existing routes
app.post('/login', loginUser);
app.post('/register', registerUser);
app.use('/file', fileUploadRouter);
app.post('/getimages', getImages);

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});