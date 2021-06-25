class Storage {
  static getBooksFromLS() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static displayBooks() {
    const books = Storage.getBooksFromLS();

    for (let i = 0; i < books.length; i++) {
      let book = books[i];
      // console.log(books[i]);
      // console.log(i);
      if (books[i].section === "to-read") {
        UI.addBookToList(book, ".to-read");
      } else if (books[i].section === "reading") {
        UI.addBookToList(book, ".reading");
      } else if (books[i].section === "finished") {
        UI.addBookToList(book, ".finished");
      }
    }
  }

  static addBookToLS(book) {
    const books = Storage.getBooksFromLS();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBookFromLS(title, author) {
    const books = Storage.getBooksFromLS();

    books.forEach(function (book, index) {
      if (book.title === title && book.author === author) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}
