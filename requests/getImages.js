const fs = require('fs');
const path = require('path');

// Static endpoint to get images for a specific username
function getImages(req, res) {
    const { username } = req.body;

    if (!username) {
        return res.status(400).send('Username is required in the request body');
    }

    const userFolderPath = path.join(__dirname, '../uploaded_images', username);

    fs.access(userFolderPath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('User folder not found');
        }

        fs.readdir(userFolderPath, (err, files) => {
            if (err) {
                return res.status(500).send('Error reading user folder');
            }

            const base64Images = [];

            files.forEach((file) => {
                const filePath = path.join(userFolderPath, file);
                const imgBuffer = fs.readFileSync(filePath);
                const base64String = imgBuffer.toString('base64');
                base64Images.push(base64String);
            });

            res.json({ images: base64Images });
        });
    });
};

module.exports = { getImages };
