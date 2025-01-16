const { errorCatchResponse } = require("../utilis/response");
const { cleanupUploadedFiles } = require("../utilis/cleanupUploadedFiles.js");

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch((e) => {
        cleanupUploadedFiles(req);
        return errorCatchResponse(res, e.message);
    });

module.exports = asyncHandler;