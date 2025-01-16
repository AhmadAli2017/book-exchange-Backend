const fs = require('fs');
const path = require('path');

const cleanupUploadedFiles = (req) => {
    if (!req.files || Object.keys(req.files).length === 0) return; 
    Object.keys(req.files).forEach((field) => {
        req.files[field].forEach((file) => {
            const fullFilePath = path.resolve(file.destination, file.filename);

            if (fs.existsSync(fullFilePath)) {
                try {
                    fs.unlinkSync(fullFilePath); 
                } catch (error) {
                    console.error(`Error deleting file: ${fullFilePath}`, error);
                }
            } else {
                console.warn(`File not found: ${fullFilePath}`);
            }
        });
    });
};

module.exports = { cleanupUploadedFiles };
