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
      if (books[i].section === "to-read-list") {
        UI.addBookToList(book, ".to-read-list");
      } else if (books[i].section === "reading-list") {
        UI.addBookToList(book, ".reading-list");
      } else if (books[i].section === "finished-list") {
        UI.addBookToList(book, ".finished-list");
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

  static editBookInLS(currentValue, newValue, title, author) {
    const books = Storage.getBooksFromLS();

    books.forEach(function (book) {
      if (book.title === title && book.author === author) {
        // console.log(currentValue);
        if (currentValue === book.title) {
          book.title = newValue;
        } else if (currentValue === book.author) {
          book.author = newValue;
        } else if (currentValue === book.publisher) {
          book.publisher = newValue;
        } else if (currentValue === book.isbn) {
          book.isbn = newValue;
        }
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }

  
  static setPage(newPage){ 
     localStorage.setItem('currentPage', newPage)
  }
}
