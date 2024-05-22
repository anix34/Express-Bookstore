## **Express Bookstore**

An express.js application to practice validating APIs using JSONSchema.

- Here is an example of what a book object should look like:

```jsx
{
  "isbn": "0691161518",
  "amazon_url": "http://a.co/eobPtX2",
  "author": "Matthew Lane",
  "language": "english",
  "pages": 264,
  "publisher": "Princeton University Press",
  "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
  "year": 2017
}
```

Application consists of the following routes:
a
**GET /books :** Responds with a list of all the books

**POST /books :** Creates a book and responds with the newly created book

**GET /books/[isbn] :** Responds with a single book found by its ***isbn***

**PUT /books/[isbn] :** Updates a book and responds with the updated book

**DELETE /books/[isbn] :** Deletes a book and responds with a message of “Book deleted”
