import React, {useState, useEffect} from "react";
import Header from "./Header.jsx";

function App() {
  return (
    <div>
      <Header />
      <div className="title">
        <h1>Book Explorer</h1>
      </div>
      <div className="book-list">
        <bookList />
      </div>
    </div>
  );
}

// Renders book from the library 
function bookCard({book, onSelect}) {
  const coverUrl = book_cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null;

  return (
    <button className="book-card" onClick={() => onSelect(book)}>
      <div className="cover-url">
        (coverUrl ? (
          <img src={coverUrl} className="cover"/>
        ) : (
          <div className="cover-placeholder">No cover</div>
        ))
      </div>
        <div className="book-info">
          <p className="book-title">
            {book.title}
          </p>
          <p className="book-author">
            {book.author ? book.author.join(", ") : "Unknown author"}
          </p>
          <p className="book-year">
            {book.year ? book.year.join(", ") : "Unknown first published year"}
          </p>
        </div>
    </button>
  );
}

function bookList({books, onSelect}) {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <bookCard key={book.key} book={book} onSelect={onSelect}
      ></bookCard>
      ))}
    </div>
  );
}

// Display the details for each book using modals 
function bookDetails({book, onClose}) {
  if (!book) return null;
  const coverUrl = book_cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i class="bi bi-x"></i>
        </button>
        <div className="modal-header">
          {coverUrl ? (
            <img src={coverUrl} className="book-cover"/>
          ) : (
            <div className="cover-placeholder modal">No cover</div>
          )}
        <div>
          <h2 className="modal-title">
            {book.title}
          </h2>
          <p className="modal-author">
            {book.author ? book.author.join(", ") : "Unknown author"}
          </p>
          <p className="modal-other">
            First published: {book.year ? book.year.join(", ") : "Unknown first published year"}
          </p>
          <p className="modal-other">
            Editions: {book.edition ?? "Unknown"}
          </p>
        </div>
      </div>

      <div className="modal-body">
        <h3 className="modal-subheader">Subjects</h3>
        {book.subject && book.subject.length > 0 ? (
          <div className="tags">
            {book.subject.slice(0, 12).map((s) => (
              <span className="tag" key={s}>
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="modal-other">No data available.</p>
        )}
      </div>
    </div>
  </div>
  );
}

export default App;