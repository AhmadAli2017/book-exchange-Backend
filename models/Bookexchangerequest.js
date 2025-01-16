const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    status: { type: String, default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who initiated the request
  },
  { timestamps: true }
);

const ExchangeRequest = mongoose.model('ExchangeRequest', exchangeRequestSchema);
module.exports = ExchangeRequest;
