const express = require("express");
const { checkUserAuth } = require("../middlewares/auth_middleware");
const { validateBookCreation, validateBookUpdate } = require("../middlewares/validations");
const { createBook, getAllBooks, getBookById, updateBook, deleteBook } = require("../controllers/bookListingController");
const storageData = require("../config/multer");
const { getMatchingBooks, createExchangeRequest, getAllExchangeRequest, getAllExchangeRequestloggedUser, AcceptRejectRequest } = require("../controllers/ExchangeReqController");
const router = express.Router();

const upload = storageData("books");

// Books
router.post("/create", checkUserAuth, upload.single('Image'), validateBookCreation, createBook);
router.get("/", checkUserAuth, getAllBooks);
router.get("/:id", checkUserAuth, getBookById);
router.put("/:id", checkUserAuth, upload.single('Image'), validateBookUpdate, updateBook);
router.delete("/:id", checkUserAuth, deleteBook);


router.get('/matchmaking', getMatchingBooks);
router.post('/matchmaking', checkUserAuth, getAllExchangeRequestloggedUser);
router.post('/matchmaking/exchange-request',checkUserAuth, createExchangeRequest);
router.get('/matchmaking/exchange-request',checkUserAuth, getAllExchangeRequest);

router.put('/exchange-request/:id', AcceptRejectRequest);

module.exports = router;
