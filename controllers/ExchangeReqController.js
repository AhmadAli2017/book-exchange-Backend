const { validationResult } = require('express-validator');
const asyncHandler = require('../middlewares/trycatch');
const { responseData, errorResponse } = require('../utilis/response');
const { cleanupUploadedFiles } = require('../utilis/cleanupUploadedFiles');
const Book = require('../models/Book');
const ExchangeRequest = require('../models/Bookexchangerequest');



const createExchangeRequest = asyncHandler(async (req, res) => {
    const { bookId, senderId, receiverId } = req.body;

    if (!bookId || !senderId || !receiverId) {
        return errorResponse(res, 'Missing required fields', 400);
    }

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
        return errorResponse(res, 'Book not found', 404);
    }

    const userId = req.user._id; // Assuming req.user is populated via middleware (e.g., auth)

    // Check if an exchange request already exists
    const existingRequest = await ExchangeRequest.findOne({
        bookId,
        sender: senderId,
        receiver: receiverId,
        status: 'pending',
    });

    if (existingRequest) {
        return errorResponse(res, 'Exchange request already exists', 400);
    }

    // Create a new exchange request
    const exchangeRequest = await ExchangeRequest.create({
        bookId,
        sender: senderId,
        receiver: receiverId,
        user: userId, // Use `user` as defined in the schema
    });

    return responseData(res, true, 201, exchangeRequest, 'Exchange Request has been sent successfully');
});



const getAllExchangeRequest = asyncHandler(async (req, res) => {
    const books = await ExchangeRequest.find({});
    if (!books) {
        return errorResponse(res, 'No Data Found', 404);

    } else {
        return responseData(res, true, 200, books, 'Requests fetched successfully');

    }
});

const getAllExchangeRequestloggedUser = asyncHandler(async (req, res) => {
    const { user } = req;

    if (!user) {
        return errorResponse(res, 'User not found', 404);
    }

    const exchangeRequests = await ExchangeRequest.find({
        receiver: user._id,
    })
        .populate('bookId');

    if (!exchangeRequests || exchangeRequests.length === 0) {
        return errorResponse(res, 'No exchange requests found for this user', 404);
    } else {
        return responseData(res, true, 200, exchangeRequests, 'Exchange requests fetched successfully');
    }
});


const AcceptRejectRequest = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the request ID from the route parameter
    const { action } = req.body; // Action (accept or reject)

    // Ensure the action is valid
    if (!['accept', 'reject'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
    }

    // Find the request by its ID
    const request = await ExchangeRequest.findById(id);

    if (!request) {
        return res.status(404).json({ message: 'Exchange request not found.' });
    }

    // Update the status of the request
    if (action === 'accept') {
        request.status = 'Accepted';
    } else if (action === 'reject') {
        request.status = 'Rejected';
    }

    // Save the updated request
    await request.save();

    res.status(200).json({ message: `Request ${action}ed successfully`, request });
});

const getMatchingBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({});
    if (!books) {
        return errorResponse(res, 'No books found for matchmaking', 404);

    } else {
        return responseData(res, true, 200, books, 'Book fetched successfully');

    }
});

module.exports = {
    getMatchingBooks,
    createExchangeRequest,
    getAllExchangeRequest,
    getAllExchangeRequestloggedUser,
    AcceptRejectRequest
};
