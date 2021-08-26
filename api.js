class ApiBook {
  constructor(isbn) {
    this.isbn = isbn;
  }

  async getJsonBook() {
    const response = await fetch(
      `https://openlibrary.org/isbn/${this.isbn}.json`
    );

    const data = await response.json();
    return data;
  }

  async getBookTitle(title) {
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${title}`
    );

    const data = await response.json();
    return data;
  }
}
