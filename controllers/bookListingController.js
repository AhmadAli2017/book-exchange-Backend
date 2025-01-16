const { validationResult } = require('express-validator');
const asyncHandler = require('../middlewares/trycatch');
const { responseData, errorResponse } = require('../utilis/response');
const { cleanupUploadedFiles } = require('../utilis/cleanupUploadedFiles');
const Book = require('../models/Book');
const ExchangeRequest = require('../models/Bookexchangerequest');

// Create a book
const createBook = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        cleanupUploadedFiles(req);
        return errorResponse(res, errors.array()[0].msg);
    }

    const file = req.file;

    // Check if the file exists
    if (!file) {
        return errorResponse(res, 'Book cover image is required', 400);
    }

    // Generate the image URL
    const bookImage = `${process.env.BASE_URL}/books/${file.filename}`;

    // Extract userId from the authenticated request
    const userId = req.user._id;

    const { title, author, genre } = req.body;

    // Create a new book document
    const book = new Book({
        title,
        author,
        genre,
        image: bookImage,
        user: userId, // Set the userId in the model
    });

    await book.save();

    // Populate the user information in the response
    await book.populate('user', 'username email');

    return responseData(res, true, 201, book, 'Book added successfully');
});




const updateBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
        cleanupUploadedFiles(req);
        return errorResponse(res, 'Book not found', 404);
    }

    const { title, author, genre } = req.body;
    const file = req.file || null;

    // If a file is uploaded, generate the image URL
    let bookImage = book.image;  // Default to the existing image URL
    if (file) {
        bookImage = `${process.env.BASE_URL}/books/${file.filename}`;
    }

    // Update the book details
    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.image = bookImage;  // Update the image field

    // Save the updated book
    await book.save();

    return responseData(res, true, 200, book, 'Book updated successfully');
});


// Get all books
const getAllBooks = asyncHandler(async (req, res) => {
    try {
        // Fetch all books
        const books = await Book.find().populate('user', 'email _id');

        // Attach exchange request statuses to each book
        const booksWithStatuses = await Promise.all(
            books.map(async (book) => {
                const exchangeRequests = await ExchangeRequest.find({ bookId: book._id });
                return {
                    ...book.toObject(),
                    exchangeRequests: exchangeRequests.map((req) => ({
                        sender: req.sender,
                        receiver: req.receiver,
                        status: req.status,
                        createdAt: req.createdAt,
                    })),
                };
            })
        );

        return responseData(res, true, 200, booksWithStatuses, 'Books fetched successfully');
    } catch (error) {
        console.error('Error during fetching books and statuses:', error);
        return responseData(res, false, 500, null, 'Error fetching books');
    }
});




// Get a single book
const getBookById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
        return errorResponse(res, 'Book not found', 404);
    }
    return responseData(res, true, 200, book, 'Book fetched successfully');
});


// Delete a book
const deleteBook = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
        return errorResponse(res, 'Book not found', 404);
    }

    await Book.deleteOne({ _id: id });

    return responseData(res, true, 200, null, 'Book deleted successfully');
});

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
};
