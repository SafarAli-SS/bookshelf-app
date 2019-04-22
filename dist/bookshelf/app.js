const form = document.querySelector(".form");
const bookList = document.querySelector("#book-list");

function renderBookList(book) {
  let tableRow = document.createElement("tr");
  let title = document.createElement("td");
  let author = document.createElement("td");
  title.contentEditable = true;
  author.contentEditable = true;
  let tdDelete = document.createElement("td");
  let tdEdit = document.createElement("td");
  tdDelete.innerHTML = `
    <button class="btn btn-sm btn-danger">
      Delete
    </button>
  `;
  tdEdit.innerHTML = `
  <button class="btn btn-sm btn-warning">
    Update
  </button>
`;
  title.textContent = book.data().title;
  author.textContent = book.data().author;

  tableRow.setAttribute("data-id", book.id);
  tableRow.appendChild(title);
  tableRow.appendChild(author);
  tableRow.appendChild(tdDelete);
  tableRow.appendChild(tdEdit);

  bookList.appendChild(tableRow);

  //Deleting book
  tdDelete.addEventListener("click", event => {
    event.stopPropagation();
    let id = event.target.parentElement.parentElement.getAttribute("data-id");
    db.collection("books")
      .doc(id)
      .delete();
  });

  //Editing and updating book info
  tdEdit.addEventListener("click", event => {
    let id = event.target.parentElement.parentElement.getAttribute("data-id");
    db.collection("books")
      .doc(id)
      .update({
        title: title.textContent,
        author: author.textContent
      });

    //Refreshing the page after update in order to be in sync with database
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });
}

//Getting data from Firebase and applying real-time changes
db.collection("books").onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type === "added") {
      renderBookList(change.doc);
    } else if (change.type === "removed") {
      let row = bookList.querySelector("[data-id=" + change.doc.id + "]");
      bookList.removeChild(row);
    }
  });
});

//Adding books to list
form.addEventListener("submit", event => {
  event.preventDefault();
  db.collection("books").add({
    title: form.title.value,
    author: form.author.value
  });
  form.title.value = "";
  form.author.value = "";
});
