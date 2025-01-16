const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        genre: { type: String, required: true },
        image: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
    },
    { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
