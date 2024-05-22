/** Common config for bookstore. */

require("dotenv").config();

const DB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.DB_URI_TEST
    : process.env.DB_URI_PROD;

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  DB_URI,
  SECRET_KEY,
};