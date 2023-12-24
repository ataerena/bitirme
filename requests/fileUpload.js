const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const router = express.Router();

router.use(fileUpload());

router.post('/upload', (req, res) => {
    if (!req.files || !req.files.image) {
        return res.status(400).send('No files were uploaded.');
    }


    const image = req.files.image;
    const directory = `../uploaded_images/${req.body.username}`;

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    image.mv(`${directory}/${image.name}`, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('File uploaded successfully.');
    });
});

module.exports = router;
