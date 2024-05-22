process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require("../db");

const EXAMPLE_BOOK = {
  isbn: "0691161518",
  amazon_url: "http://a.co/eobPtX2",
  author: "Matthew Lane",
  language: "english",
  pages: 264,
  publisher: "Princeton University Press",
  title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
  year: 2017,
};

const EXAMPLE_BOOK_ISBN = "0691161518";

beforeEach(async () => {
  await db.query("DELETE FROM books");
  await request(app).post("/books").send(EXAMPLE_BOOK);
});

afterEach(async () => {
  await db.query("DELETE FROM books");
});

afterAll(async () => {
  await db.end();
});

describe("GET /books", () => {
  test("Get all books", async () => {
    let result = await request(app).get("/books");

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      books: [
        {
          isbn: "0691161518",
          amazon_url: "http://a.co/eobPtX2",
          author: "Matthew Lane",
          language: "english",
          pages: 264,
          publisher: "Princeton University Press",
          title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
          year: 2017,
        },
      ],
    });
  });
});

describe("GET /books/[isbn]", () => {
  test("Get book by isbn", async () => {
    let result = await request(app).get(`/books/${EXAMPLE_BOOK_ISBN}`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      book: {
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017,
      },
    });
  });

  test("Request to get book with invalid isbn, returns error", async () => {
    let result = await request(app).get(`/books/0`);

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual({
      error: {
        message: "There is no book with an isbn '0'",
        status: 404,
      },
    });
  });
});

describe("POST /books", () => {
  test("Adding a book", async () => {
    let result = await request(app).post("/books").send({
      isbn: "1593279507",
      amazon_url: "https://a.co/d/a2Ye3nz",
      author: "Marijn Haverbeke",
      language: "english",
      pages: 472,
      publisher: "No Starch Press",
      title: "Eloquent JavaScript, A Modern Introduction to Programming",
      year: 2018,
    });

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual({
      book: {
        isbn: "1593279507",
        amazon_url: "https://a.co/d/a2Ye3nz",
        author: "Marijn Haverbeke",
        language: "english",
        pages: 472,
        publisher: "No Starch Press",
        title: "Eloquent JavaScript, A Modern Introduction to Programming",
        year: 2018,
      },
    });
  });

  test("Request to add book with invalid schema, returns list of errors", async () => {
    const result = await request(app).post("/books").send({
      author: "John Doe",
      language: "english",
      pages: 1100,
      title: "Different Dummy Data",
      year: 2023,
    });

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual({
      error: {
        message: [
          'instance requires property "isbn"',
          'instance requires property "amazon_url"',
          'instance requires property "publisher"',
        ],
        status: 400,
      },
    });
  });
});

describe("PUT /books/[isbn]", () => {
  test("Updating a book", async () => {
    let result = await request(app).put(`/books/${EXAMPLE_BOOK_ISBN}`).send({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 300,
      publisher: "Princeton University Press",
      title:
        "Power-Up: Unlocking the Hidden Mathematics in Video Games, 2ND EDITION",
      year: 2023,
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      book: {
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 300,
        publisher: "Princeton University Press",
        title:
          "Power-Up: Unlocking the Hidden Mathematics in Video Games, 2ND EDITION",
        year: 2023,
      },
    });
  });

  test("Request to update book with invalid schema, returns list of errors", async () => {
    const result = await request(app).put(`/books/${EXAMPLE_BOOK_ISBN}`).send({
      author: "John Doe",
      language: "english",
      pages: 1100,
      title: "Different Dummy Data",
      year: 2023,
    });

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual({
      error: {
        message: [
          'instance requires property "isbn"',
          'instance requires property "amazon_url"',
          'instance requires property "publisher"',
        ],
        status: 400,
      },
    });
  });

  test("Request to update book with valid schema, but invalid isbn returns a 404 error", async () => {
    const result = await request(app).put("/books/1").send({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 300,
      publisher: "Princeton University Press",
      title:
        "Power-Up: Unlocking the Hidden Mathematics in Video Games, 2ND EDITION",
      year: 2023,
    });

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual({
      error: {
        message: `There is no book with an isbn '1'`,
        status: 404,
      },
    });
  });
});

describe("DELETE /[isbn]", () => {
  test("Deleting a book with a valid isbn", async () => {
    let result = await request(app).delete(`/books/${EXAMPLE_BOOK_ISBN}`);
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      message: "Book deleted",
    });
  });

  test("Request to delete book with invalid isbn returns 404 error", async () => {
    let result = await request(app).delete(`/books/9`);

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual({
      error: {
        message: `There is no book with an isbn '9'`,
        status: 404,
      },
    });
  });
});