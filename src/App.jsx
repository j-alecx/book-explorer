import React, {useState, useEffect} from "react";
import Header from "./Header.jsx";

function App() {
  return (
    <div>
      <Header />
      <div className="title">
        <h1>Book Explorer</h1>
            <div className="description">
                <p>A digital library that allows users to discover and search for books.
                   Users can browse a wide collection of publicly available books,
                   search for titles or authors, and view important information such as
                   book titles, descriptions, publication details, and genres.</p>
            </div>
      </div>
    </div>
  );
}

export default App;