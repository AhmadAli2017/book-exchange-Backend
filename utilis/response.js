const response = (res, success, status, message) => {
    res.status(status).json({ success, status, message });
};

const responseData = (res, success, status, data, message,) => {
    if (message) {
        res.status(status).json({ success, status, message, data });
    } else {
        res.status(status).json({ success, status, data });
    }
};
const errorResponse = (res, message) => {
    res.status(400).json({ success: false, status: 400, message });
};

const errorCatchResponse = (res, message) => {
    res.status(500).json({ success: false, status: 500, message });
};

module.exports = { response, responseData, errorResponse, errorCatchResponse }

