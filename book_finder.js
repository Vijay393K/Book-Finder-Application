import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";

function SearchPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/results?title=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="search-page">
      <div className="search-overlay">
        <h1 className="title">Book Finder</h1>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-bar"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
        <div className="quotes">
          <marquee behavior="scroll" direction="left">
            “A room without books is like a body without a soul.” — Cicero
            &nbsp; | &nbsp; “So many books, so little time.” — Frank Zappa
            &nbsp; | &nbsp; “Books are a uniquely portable magic.” — Stephen
            King
          </marquee>
        </div>
      </div>
    </div>
  );
}

function ResultsPage() {
  const [books, setBooks] = useState([]);
  const query = new URLSearchParams(window.location.search).get("title");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (query) {
      fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      )
        .then((res) => res.json())
        .then((data) => {
          setBooks(data.docs || []);
        });
    }
  }, [query]);

  // helper to show fallback when image fails
  const handleImgError = (e) => {
    const card = e.currentTarget.closest(".book-card");
    e.currentTarget.style.display = "none";
    const fb = card?.querySelector(".fallback-cover");
    if (fb) fb.style.display = "flex";
  };

  return (
    <div className="results-page">
      <header className="results-header">
        <h1 className="results-title">Book Finder</h1>
        <button className="return-button" onClick={() => navigate("/")}>
          ← Back
        </button>
      </header>
      <div className="results-grid">
        {books.map((book, index) => {
          const imageUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : null;

          return (
            <div className="book-card" key={index}>
              <div className="cover-wrap">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={book.title}
                    className="book-cover"
                    onError={handleImgError}
                  />
                )}
                <div
                  className="fallback-cover"
                  style={{ display: imageUrl ? "none" : "flex" }}
                >
                  <span>{book.title}</span>
                </div>
              </div>
              <div className="book-details">
                <p>
                  <strong>{book.title}</strong>
                </p>
                <p>
                  {book.author_name ? book.author_name[0] : "Unknown Author"}
                </p>
                <p>{book.first_publish_year || "N/A"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}
