import React, {useState, useEffect} from "react";
import Header from "./Header.jsx";

// Renders book from the library 
function BookCard({book, onSelect}) {
  const coverUrl = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null;

  return (
    <button className="book-card" onClick={() => onSelect(book)}>
      <div className="cover-url">
        {coverUrl ? (
          <img src={coverUrl} className="cover"/>
        ) : (
          <div className="cover-placeholder">No cover</div>
        )}
      </div>
        <div className="book-info">
          <p className="book-title">
            {book.title}
          </p>
          <p className="book-author">
            {book.author_name ? book.author_name.join(", ") : "Unknown author"}
          </p>
          <p className="book-year">
            {book.first_publish_year ?? "Unknown first published year"}
          </p>
        </div>
    </button>
  );
}

function BookList({books, onSelect}) {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.key} book={book} onSelect={onSelect}
      ></BookCard>
      ))}
    </div>
  );
}

// Display the details for each book using modals 
function BookDetails({book, onClose}) {
  const[details,setDetails] = useState(null);

  useEffect(() => {
    if (!book) return;
    setDetails(null);
    fetch(`https:operlibrary.org${book.key}.json`)
      .then((res) => res.jsson())
      .then((data) => setDetails(data))
      .catch (() =>  setDetails(null));
  })
  
  if (!book) return null;
  const coverUrl = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="bi bi-x"></i>
        </button>
        <div className="modal-header">
          {coverUrl ? (
            <img src={coverUrl} className="modal-cover"/>
          ) : (
            <div className="cover-placeholder modal">No cover</div>
          )}
        <div>
          <h2 className="modal-title">
            {book.title}
          </h2>
          <p className="modal-author">
            {book.author_name ? book.author_name.join(", ") : "Unknown author"}
          </p>
          <p className="modal-other">
            First published: {book.first_publish_year ?? "Unknown first published year"}
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

export default function App () {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    if (!submittedQuery.trim()) {
      setBooks([]);
      setStatus("Idle");
      return;
    }

    const controller = new AbortController();

    async function fetchBooks() {
      setStatus("Loading");
      setErrorMessage("");
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(submittedQuery)}`,
        { signal: controller.signal}
      );

      if (!res.ok) {
        throw new Error(`Request failed (status ${res.status})`);
      }

      const data = await res.json();
      setBooks(data.docs || []);
      setStatus("Success");
      } catch (err) {
        if (err.name !== "AbortError") {
          setErrorMessage(err.message || "Something went wrong.");
          setStatus("Error");
        }
      }
    }

    fetchBooks();
    return() => controller.abort();
  }, [submittedQuery]);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmittedQuery(query.trim());
  }

  return (
    <div className="app">
      <div>
        <Header />
        <div className="title">
          <h1>Book Explorer</h1>
        </div>
      </div>
      <form className="search" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}/>
        <button
          type="submit"
          className="search-button"
          disabled={status === "Loading" || !query.trim()}>
            Search
        </button>
      </form>

      {/* Statuses */}
      {status === "Loading" && (
        <div className="status-message">
          <div className="spinner"/>
          Searching books...
        </div>
      )}

      {status === "Error" && (
        <div className="status-message error">
          Something went wrong: {errorMessage}
        </div>
      )}

      {status === "Success" && books.length === 0 && (
        <div className="status-message">
          No books found.
        </div>
      )}

      {status === "Success" && books.length > 0 && (
        <BookList books={books} onSelect={setSelectedBook} />
      )}

      {status === "Idle" && !submittedQuery && (
        <div className="status-message">
          Search for a book title or author.
        </div> 
      )}

      <BookDetails book={selectedBook} onClose={() => setSelectedBook(null)}/>
    </div> 
  );
}