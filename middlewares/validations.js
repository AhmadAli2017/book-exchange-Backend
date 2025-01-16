const { body, check } = require("express-validator");
const isEmail = require("validator/lib/isEmail");

const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
const validateUpdateUser = [
  body("username").optional().notEmpty().withMessage("Username is required"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const validateSignup = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),
  body("password_confirmation")
    .notEmpty()
    .withMessage("Confirm password is required")
    .isLength({ min: 8 })
    .withMessage("Confirm password must be at least 8 characters long")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Confirm password must contain at least one special character")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
];

const validateAddress = [
  body("firstName").notEmpty().withMessage("First name is required"),

  body("lastName").notEmpty().withMessage("Last name is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("countryRegion").notEmpty().withMessage("Country/Region is required"),

  body("state").notEmpty().withMessage("State is required"),

  body("zipCode")
    .notEmpty()
    .withMessage("Zip Code is required")
    .isPostalCode("any") // validates international postal codes
    .withMessage("Invalid Zip Code format"),

  body("streetAddress").notEmpty().withMessage("Street address is required"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any") // validates international phone numbers
    .withMessage("Invalid phone number format"),
];

const validatePasswordReset = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),
  body("newPassword_confirmation")
    .notEmpty()
    .withMessage("Confirm password is required")
    .isLength({ min: 8 })
    .withMessage("Confirm password must be at least 8 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const validateChangePassword = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),
  body("newPassword_confirmation")
    .notEmpty()
    .withMessage("Confirm password is required")
    .isLength({ min: 8 })
    .withMessage("Confirm password must be at least 8 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const validateCreateProduct = [
  body("productName")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string"),

  body("productDescription")
    .notEmpty()
    .withMessage("Product description is required")
    .isString()
    .withMessage("Product description must be a string"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("discountPrice")
    .optional({ checkFalsy: true }) // Allows undefined, null, or empty string
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount price must be a number between 0 and 100"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isString()
    .withMessage("Category must be a string"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isString()
    .withMessage("Stock must be a string")
    .custom((value) => {
      const allowedValues = ["In-stock", "Out-of-stock"];
      if (!allowedValues.includes(value)) {
        throw new Error(
          `Stock must be one of the following: ${allowedValues.join(", ")}`
        );
      }
      return true;
    }),

  body("sku")
    .notEmpty()
    .withMessage("SKU is required")
    .isString()
    .withMessage("SKU must be a string"),
];

const validateGift = [
  body("giftName").notEmpty().withMessage("Gift name is required"),
  body("giftDescription")
    .notEmpty()
    .withMessage("Gift description is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("discountPrice")
    .optional({ checkFalsy: true }) // Allows undefined, null, or empty string
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount price must be a number between 0 and 100"),
  body("sku").notEmpty().withMessage("SKU is required"),
  // body("category").notEmpty().withMessage("Category is required"),
  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isString()
    .withMessage("Stock must be a string")
    .custom((value) => {
      const allowedValues = ["In-stock", "Out-of-stock"];
      if (!allowedValues.includes(value)) {
        throw new Error(
          `Stock must be one of the following: ${allowedValues.join(", ")}`
        );
      }
      return true;
    }),
];

const reviewValidationRules = [
  check("productId").isMongoId().withMessage("Invalid product ID"),
  check("review").notEmpty().withMessage("Review text is required"),
  check("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
];

const validateOrder = [
  body("items")
    .isArray()
    .withMessage("Items must be an array")
    .notEmpty()
    .withMessage("Items cannot be empty"),

  body("paymentType").isString().withMessage("Payment type is required"),

  body("shippingAddress")
    .isString()
    .withMessage("Shipping address is required"),

  body("subtotal").isNumeric().withMessage("Subtotal must be a number"),

  body("total").isNumeric().withMessage("Total must be a number"),

  body("discount")
    .isString()
    .withMessage('Discount must be a percentage string (e.g., "20%")')
    .matches(/^(\d{1,2}|100)%$/)
    .withMessage(
      'Discount must be in the format of "X%" where X is a number from 0 to 100'
    ),

  body("discountPrice")
    .isNumeric()
    .withMessage("Discount price must be a number")
    .custom((value) => value >= 0)
    .withMessage("Discount price cannot be negative"), // Ensure it's non-negative

  body("deliveryCharges")
    .optional() // Make deliveryCharges optional
    .isNumeric()
    .withMessage("Delivery charges must be a number")
    .custom((value) => value === 0)
    .withMessage("Delivery charges cannot be negative"), // Ensure it matches static value
];

const validateBlog = [
  check("name").notEmpty().withMessage("Name is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("writer").notEmpty().withMessage("Writer is required"),
];

const validateContactUsForm = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters long"),
];

// Validation for creating a book
const validateBookCreation = [
  body("title")
    .notEmpty()
    .withMessage("Book title is required")
    .isLength({ max: 100 })
    .withMessage("Title must not exceed 100 characters"),
  body("author")
    .notEmpty()
    .withMessage("Author name is required")
    .isLength({ max: 50 })
    .withMessage("Author name must not exceed 50 characters"),
  body("genre")
    .notEmpty()
    .withMessage("Genre is required"),
];

const validateBookUpdate = [
  body("title")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Title must not exceed 100 characters"),
  body("author")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Author name must not exceed 50 characters"),
  body("genre")
    .optional()
    .notEmpty()
    .withMessage("Genre cannot be empty"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("isbn")
    .optional()
    .isISBN()
    .withMessage("Invalid ISBN format"),
];




module.exports = {
  validateLogin,
  validateSignup,
  validatePasswordReset,
  validateChangePassword,
  validateCreateProduct,
  validateUpdateUser,
  validateGift,
  reviewValidationRules,
  validateAddress,
  validateOrder,
  validateBlog,
  validateContactUsForm,


  validateBookCreation,
  validateBookUpdate,
};
