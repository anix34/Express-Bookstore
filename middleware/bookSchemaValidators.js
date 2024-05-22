const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");
const ExpressError = require("../expressError");

/**
 * Middleware to validate book data using JSONSchema when creating or updating books.
 * If validation fails, passes an ExpressError with a list of validation errors to the next middleware.
 */

function validateBookDataWithSchema(req, res, next) {
  const result = jsonschema.validate(req.body, bookSchema);

  if (!result.valid) {
    let listOfErrors = result.errors.map((err) => err.stack);
    return next(new ExpressError(listOfErrors, 400));
  }
  return next();
}

module.exports = { validateBookDataWithSchema };