class UI {

  static addBookToList(book, section) {
    const bookList = document.querySelector(section);
    const bookItem = document.createElement("div");

    bookItem.innerHTML = `
    <div class="book-element">
      <div class="book-inner">
        <i class="far fa-dot-circle"></i>
        <div class="book-info">
          <p class="book-title">${book.title}</p>
          <p class="book-author">${book.author}</p>
          <p class="book-publisher invisible">${book.publisher}</p>
          <p class="book-isbn invisible">${book.isbn}</p>
        </div>
      </div>
      <div class="book-buttons">
        <i class="fas fa-info-circle book-info-button"></i>
        <i class="far fa-times-circle book-delete-button"></i>
        <i class="fas fa-angle-double-left switch-left-button"></i>
        <i class="fas fa-angle-double-right switch-right-button"></i>
      </div>
    </div>
    `;

    bookList.appendChild(bookItem);
  }

  static deleteBook(deleteButton) {
    if (deleteButton.classList.contains("book-delete-button")) {
      // accessing whole book element - parent of parent of delete button
      deleteButton.parentElement.parentElement.remove();
    }
  }

  static clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("publisher").value = "";
    document.getElementById("isbn").value = "";
  }
}
