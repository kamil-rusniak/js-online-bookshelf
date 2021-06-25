////// CORE FUNCTIONALITIES (adding, deleting, editing, displaying book info) ///////
class Book {
  constructor(title, author, publisher, isbn, section) {
    this.title = title;
    this.author = author;
    this.publisher = publisher;
    this.isbn = isbn;
    this.section = section;
  }
}

const alert = document.getElementById("alert");

//Event Listener for add button
document.getElementById("add-button").addEventListener("click", function () {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const publisher = document.getElementById("publisher").value;
  const isbn = document.getElementById("isbn").value;
  const section = "to-read";
  const book = new Book(title, author, publisher, isbn, section);

  // Validation
  if (title === "" || author === "") {
    alert.innerText = "Title and Author fields can't be empty";
    alert.classList.remove("invisible");
    setTimeout(function () {
      alert.classList.add("invisible");
    }, 5000);
  } else {
    alert.classList.add("invisible");
    UI.clearFields();
    UI.addBookToList(book, ".to-read");
    Storage.addBookToLS(book);
  }
});

// Event listener for isbn search button
document.getElementById("search-icon").addEventListener("click", function () {
  // API call
  // 0-7475-5100-6
  const isbn = document.getElementById("isbn").value;
  const apiBook = new ApiBook(isbn);

  async function getAuthor(title) {
    return apiBook
      .getBookTitle(title)
      .then((result) => {
        author = result.docs[0].author_name[0];
        // console.log(author);
        return author;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // 9780747532699
  async function getBook(book) {
    book
      .getJsonBook(book)
      .then((bookObject) => {
        // console.log(bookObject);
        makeBook(bookObject);
      })
      .catch((err) => {
        console.log(err);
        alert.innerText = "Please enter a valid ISBN number";
        alert.classList.remove("invisible");
        setTimeout(function () {
          alert.classList.add("invisible");
        }, 5000);
      });
  }

  async function makeBook(bookObject) {
    const title = bookObject.title;
    const author = await getAuthor(title);
    // console.log(author);
    const publisher = bookObject.publishers[0];
    const isbn = bookObject.isbn_13[0];
    const section = "to-read";

    const book = new Book(title, author, publisher, isbn, section);

    // console.log(author);
    // console.log(book);

    alert.classList.add("invisible");
    UI.clearFields();
    UI.addBookToList(book, ".to-read");
    Storage.addBookToLS(book);
  }

  getBook(apiBook);
});

//Event listener to display Local Storage items in UI on when page is loaded
document.addEventListener("DOMContentLoaded", Storage.displayBooks);

function bookSwitch(e, direction, section) {
  // (it takes direction where to move the book and also section in Local Storage which is also class name in CSS)
  if (e.target.classList.contains(direction)) {
    const title =
      e.target.parentElement.previousElementSibling.children[1].children[0]
        .textContent;
    const author =
      e.target.parentElement.previousElementSibling.children[1].children[1]
        .textContent;
    const books = Storage.getBooksFromLS();

    for (let i = 0; i < books.length; i++) {
      let book = books[i];
      if (books[i].title === title && books[i].author === author) {
        UI.addBookToList(book, `.${section}`);
        books[i].section = section;
        localStorage.setItem("books", JSON.stringify(books));
        i++;
        e.target.parentElement.parentElement.remove();
      }
    }
  }
}

function bookDelete(e) {
  // in this case, delete button is target of the event(it happens when we click the button)
  if (e.target.classList.contains("book-delete-button")) {
    const title =
      e.target.parentElement.previousElementSibling.children[1].children[0]
        .textContent;
    const author =
      e.target.parentElement.previousElementSibling.children[1].children[1]
        .textContent;
    UI.deleteBook(e.target);
    // we go trough parents, siblings and children of our target delete button to access title and author wihin the same book element as clicked delete button
    Storage.removeBookFromLS(title, author);
  }
}

function bookInfo(e) {
  // showing windows with book details
  if (e.target.classList.contains("book-info-button")) {
    const title =
      e.target.parentElement.previousElementSibling.children[1].children[0]
        .textContent;
    const author =
      e.target.parentElement.previousElementSibling.children[1].children[1]
        .textContent;
    const publisher =
      e.target.parentElement.previousElementSibling.children[1].children[2]
        .textContent;
    const isbn =
      e.target.parentElement.previousElementSibling.children[1].children[3]
        .textContent;

    const bookDetails = document.querySelector(".book-details");
    const bookDetailsContent = document.createElement("div");
    bookDetailsContent.classList.add = "book-details-content";

    bookDetailsContent.innerHTML = `<div class="book-details-content">
        <span class="book-details-close">&times;</span>
        <div class="book-details-text">
          <div class="book-details-text-inner">
            <div class="book-details-header-text">
            <h2>Title</h2>
          </div>
          <p>${title}</p>
          </div>
          <div class="book-details-text-inner">
            <div class="book-details-header-text">
              <h2>Author</h2>
            </div>
            <p>${author}</p>
            </div>
          <div class="book-details-text-inner">
            <div class="book-details-header-text">
              <h2>Publisher</h2>
            </div>
            <p>${publisher}</p>
            </div>
          <div class="book-details-text-inner">
            <div class="book-details-header-text">
              <h2>ISBN</h2>
            </div>
            <p>${isbn}</p>
            </div>
        </div>
        <img src="http://covers.openlibrary.org/b/isbn/${isbn}-L.jpg" alt="${title} Book Cover" />
      </div>`;

    bookDetails.appendChild(bookDetailsContent);

    const bookDetailsInputs = document.querySelectorAll(".book-details-input");
    bookDetailsInputs.forEach(function (input) {
      input.readOnly = true;
    });

    // const bookDetailsTitle = document.getElementById("book-details-title");
    // bookDetailsTitle.readOnly = true;

    const detailsClose = document.querySelector(".book-details-close");
    bookDetails.style.display = "block";
    detailsClose.onclick = function () {
      bookDetails.style.display = "none";
      bookDetailsContent.remove();
    };
    window.onclick = function (event) {
      if (event.target === bookDetailsContent) {
        bookDetails.style.display = "none";
        bookDetailsContent.remove();
      }
    };
  }
}

// Event listeners for book buttons in different reading sections
document.querySelector(".to-read").addEventListener("mouseup", function (e) {
  bookSwitch(e, "switch-right-button", "reading"); // switching book from 'to-read' to 'reading'
  bookDelete(e);
  bookInfo(e);
});

document.querySelector(".reading").addEventListener("click", function (e) {
  bookSwitch(e, "switch-left-button", "to-read"); // switching book from 'reading' to 'to-read'
  bookSwitch(e, "switch-right-button", "finished"); // switching book from 'reading' to 'finished'
  bookDelete(e);
  bookInfo(e);
});

document.querySelector(".finished").addEventListener("click", function (e) {
  bookSwitch(e, "switch-left-button", "reading"); // switching book from 'finished' to 'reading'
  bookDelete(e);
  bookInfo(e);
});

// Event listeners for edit button in book info window
document
  .querySelector(".book-details")
  .addEventListener("click", function (e) {});

/////////////// SWITCHING SECTIONS AND CSS STUFF ////////////

const sectionButtons = document.querySelectorAll(".change-button");
const segmentButtons = document.querySelectorAll(".segment-button");
sectionButtons.forEach((item) => item.addEventListener("click", changeTab));
segmentButtons.forEach((item) => item.addEventListener("click", changeSegment));

function changeTab() {
  resetSections();
  const currentButton = document.querySelector(`#${this.id}`);
  const currentSection = document.querySelector(`.${this.id}`);
  currentButton.classList.toggle("active-btn");
  currentSection.classList.toggle("active-section");
}

function changeSegment() {
  resetSegments();
  const currentSegment = document.querySelector(`.${this.id}`);
  currentSegment.classList.toggle("active-book-segment");
}

function resetSegments() {
  const segments = document.querySelectorAll(".book-segment");
  segments.forEach((item) => item.classList.remove("active-book-segment"));
}

function resetSections() {
  const sections = document.querySelectorAll(".main-section");
  sections.forEach((item) => item.classList.remove("active-section"));
  sectionButtons.forEach((item) => item.classList.remove("active-btn"));
}
