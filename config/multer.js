const multer = require('multer');
const fs = require('fs');


const storageData = (name) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const path = `public/${name}`;
            try {
                fs.mkdirSync(path, { recursive: true });
                cb(null, path);
            } catch (err) {
                // Handle directory creation error
                cb(err.message, null);
            }
        },
        filename: (req, file, cb) => {
            const sanitizedFileName = typeof file.originalname === "string"
                ? file.originalname.replace(/[^\w.]/g, "_")
                : file.originalname;
            cb(null, Date.now() + "-" + sanitizedFileName);
        },
    });

    const upload = multer({ storage });

    return upload;
};

module.exports = storageData
