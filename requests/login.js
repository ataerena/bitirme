const usersFilePath = '../database/users.json';

const fs = require('fs');
const crypto = require('crypto');

function generateToken(length) {
  return crypto.randomBytes(length).toString('hex');
}

function loginUser(req, res) {
  const { username, password } = req.body;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const users = JSON.parse(data);
    const user = users.find((user) => user.username === username);

    if (user && user.password === password) {
      // Generate a random token
      const token = generateToken(32);

      // Calculate the token expiration time (1 hour from now)
      const tokenDestroyTime = Date.now() + 3600000; // 3600000 ms = 1 hour

      // You can associate this token with the user or save it for later validation
      // For demonstration, let's add it to the user object
      /* user.token = {
        value: token,
        destroyTime: tokenDestroyTime,
      }; */

      // Update the users array in memory or save it back to the file/database

      res.status(200).json({ message: 'Login successful', token, destroyTime: tokenDestroyTime });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
}

module.exports = { loginUser };
