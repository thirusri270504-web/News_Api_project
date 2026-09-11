import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [articles, setArticles] = useState([]);
  const [heroArticle, setHeroArticle] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("general");

  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const apiKey = process.env.REACT_APP_GNEWS_API_KEY;

  const categories = [
    {
      name: "Top News",
      value: "general",
    },
    {
      name: "World",
      value: "world",
    },
    {
      name: "Nation",
      value: "nation",
    },
    {
      name: "Business",
      value: "business",
    },
    {
      name: "Technology",
      value: "technology",
    },
    {
      name: "Sports",
      value: "sports",
    },
    {
      name: "Science",
      value: "science",
    },
    {
      name: "Health",
      value: "health",
    },
  ];

  // ==============================
  // FETCH CATEGORY NEWS
  // ==============================

  useEffect(() => {
    if (searchQuery.trim()) {
      return;
    }

    const fetchCategoryNews = async () => {
      setLoading(true);
      setError("");

      try {
        const url =
          `https://gnews.io/api/v4/top-headlines` +
          `?category=${activeCategory}` +
          `&lang=en` +
          `&max=10` +
          `&apikey=${apiKey}`;

        const response = await fetch(url);

        const data = await response.json();

        console.log("Category API Status:", response.status);

        if (!response.ok) {
          throw new Error(
            data.errors?.[0] || "Unable to fetch news"
          );
        }

        const newsArticles = data.articles || [];

        setArticles(newsArticles);

        if (newsArticles.length > 0) {
          setHeroArticle(newsArticles[0]);
        } else {
          setHeroArticle(null);
        }
      } catch (err) {
        console.error("News API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews();
  }, [activeCategory, searchQuery, apiKey]);

  // ==============================
  // SEARCH NEWS
  // ==============================

  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const fetchSearchNews = async () => {
      setLoading(true);
      setError("");

      try {
        const url =
          `https://gnews.io/api/v4/search` +
          `?q=${encodeURIComponent(searchQuery)}` +
          `&lang=en` +
          `&max=10` +
          `&apikey=${apiKey}`;

        const response = await fetch(url);

        const data = await response.json();

        console.log("Search API Status:", response.status);

        if (!response.ok) {
          throw new Error(
            data.errors?.[0] || "Unable to search news"
          );
        }

        const newsArticles = data.articles || [];

        setArticles(newsArticles);

        if (newsArticles.length > 0) {
          setHeroArticle(newsArticles[0]);
        } else {
          setHeroArticle(null);
        }
      } catch (err) {
        console.error("Search API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchNews();
  }, [searchQuery, apiKey]);

  // ==============================
  // SEARCH HANDLER
  // ==============================

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchText.trim();

    if (!query) {
      setSearchQuery("");
      return;
    }

    setSearchQuery(query);
  };

  // ==============================
  // CATEGORY HANDLER
  // ==============================

  const handleCategory = (category) => {
    setActiveCategory(category);
    setSearchQuery("");
    setSearchText("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {
    if (!date) {
      return "Today";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>

        <h2>Loading Latest News</h2>

        <p>
          Getting the latest stories for you...
        </p>
      </div>
    );
  }

  return (
    <div className="app">

      {/* ==========================
          NAVBAR
      =========================== */}

      <header className="navbar">
        <div className="nav-container">

          <a href="#home" className="logo">
            <span className="logo-icon">N</span>

            <span>
              News<span className="logo-highlight">Hub</span>
            </span>
          </a>

          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#latest">Latest</a>
            <a href="#categories">Categories</a>
          </nav>

          <form
            className="nav-search"
            onSubmit={handleSearch}
          >
            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search news..."
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            <button type="submit">
              Search
            </button>
          </form>

        </div>
      </header>

      {/* ==========================
          MAIN
      =========================== */}

      <main>

        {/* ==========================
            HERO
        =========================== */}

        <section
          className="hero-section"
          id="home"
        >
          <div className="container">

            <div className="hero-label">
              <span className="live-dot"></span>

              {searchQuery
                ? "SEARCH RESULTS"
                : "LATEST HEADLINES"}
            </div>

            {heroArticle ? (
              <div className="hero-card">

                <div className="hero-content">

                  <span className="hero-category">
                    {searchQuery
                      ? "Search"
                      : activeCategory}
                  </span>

                  <h1>
                    {heroArticle.title}
                  </h1>

                  <p>
                    {heroArticle.description ||
                      "Read the latest news and stay updated with important stories from around the world."}
                  </p>

                  <div className="hero-meta">
                    <span>
                      📰{" "}
                      {heroArticle.source?.name ||
                        "News Source"}
                    </span>

                    <span>
                      📅{" "}
                      {formatDate(
                        heroArticle.publishedAt
                      )}
                    </span>
                  </div>

                  <a
                    href={heroArticle.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hero-button"
                  >
                    Read Full Story
                    <span>→</span>
                  </a>

                </div>

                <div className="hero-image-wrapper">

                  {heroArticle.image ? (
                    <img
                      src={heroArticle.image}
                      alt={heroArticle.title}
                      className="hero-image"
                    />
                  ) : (
                    <div className="no-image hero-no-image">
                      📰
                    </div>
                  )}

                  <div className="hero-image-overlay"></div>

                </div>

              </div>
            ) : (
              <div className="empty-state">
                <div>📰</div>
                <h2>No news found</h2>
                <p>
                  Try another category or search.
                </p>
              </div>
            )}

          </div>
        </section>

        {/* ==========================
            CATEGORIES
        =========================== */}

        <section
          className="categories-section"
          id="categories"
        >
          <div className="container">

            <div className="section-heading">
              <div>
                <span className="section-tag">
                  EXPLORE
                </span>

                <h2>
                  Browse Categories
                </h2>
              </div>

              <p>
                Discover stories from different
                areas of the world.
              </p>
            </div>

            <div className="category-list">

              {categories.map((category) => (
                <button
                  key={category.value}
                  className={
                    activeCategory ===
                      category.value &&
                    !searchQuery
                      ? "category-button active"
                      : "category-button"
                  }
                  onClick={() =>
                    handleCategory(
                      category.value
                    )
                  }
                >
                  {category.name}
                </button>
              ))}

            </div>

          </div>
        </section>

        {/* ==========================
            LATEST NEWS
        =========================== */}

        <section
          className="latest-section"
          id="latest"
        >
          <div className="container">

            <div className="section-heading latest-heading">

              <div>
                <span className="section-tag">
                  {searchQuery
                    ? "SEARCH"
                    : "LATEST"}
                </span>

                <h2>
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : "Latest News"}
                </h2>
              </div>

              <span className="article-count">
                {articles.length} Stories
              </span>

            </div>

            {error && (
              <div className="error-box">
                <strong>
                  Unable to load news
                </strong>

                <p>{error}</p>

                <button
                  onClick={() =>
                    window.location.reload()
                  }
                >
                  Try Again
                </button>
              </div>
            )}

            {!error && articles.length === 0 && (
              <div className="empty-state">
                <div>🔎</div>

                <h2>
                  No articles found
                </h2>

                <p>
                  Try searching for another topic.
                </p>
              </div>
            )}

            <div className="news-grid">

              {articles
                .slice(searchQuery ? 1 : 1)
                .map((article, index) => (
                  <article
                    className="news-card"
                    key={
                      article.id ||
                      `${article.title}-${index}`
                    }
                  >

                    <div className="card-image-wrapper">

                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="card-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="no-image">
                          📰
                        </div>
                      )}

                      <span className="card-category">
                        {searchQuery
                          ? "News"
                          : activeCategory}
                      </span>

                    </div>

                    <div className="card-content">

                      <div className="card-meta">
                        <span>
                          {article.source?.name ||
                            "News Source"}
                        </span>

                        <span>
                          {formatDate(
                            article.publishedAt
                          )}
                        </span>
                      </div>

                      <h3>
                        {article.title}
                      </h3>

                      <p>
                        {article.description ||
                          "Read the full story to discover the latest updates and important details."}
                      </p>

                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="read-more"
                      >
                        Read More
                        <span>→</span>
                      </a>

                    </div>

                  </article>
                ))}

            </div>

          </div>
        </section>

        {/* ==========================
            NEWSLETTER
        =========================== */}

        <section className="newsletter-section">
          <div className="container">

            <div className="newsletter">

              <div>
                <span className="section-tag">
                  STAY INFORMED
                </span>

                <h2>
                  Never Miss a Story
                </h2>

                <p>
                  Stay updated with the latest
                  headlines and important news.
                </p>
              </div>

              <div className="newsletter-icon">
                ✉
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* ==========================
          FOOTER
      =========================== */}

      <footer className="footer">

        <div className="container">

          <div className="footer-grid">

            <div className="footer-brand">

              <a
                href="#home"
                className="logo footer-logo"
              >
                <span className="logo-icon">
                  N
                </span>

                <span>
                  News
                  <span className="logo-highlight">
                    Hub
                  </span>
                </span>
              </a>

              <p>
                Your trusted destination for
                the latest news, stories and
                updates from around the world.
              </p>

            </div>

            <div className="footer-column">

              <h4>Explore</h4>

              <a href="#home">
                Home
              </a>

              <a href="#latest">
                Latest News
              </a>

              <a href="#categories">
                Categories
              </a>

            </div>

            <div className="footer-column">

              <h4>Categories</h4>

              <button
                onClick={() =>
                  handleCategory("technology")
                }
              >
                Technology
              </button>

              <button
                onClick={() =>
                  handleCategory("business")
                }
              >
                Business
              </button>

              <button
                onClick={() =>
                  handleCategory("sports")
                }
              >
                Sports
              </button>

            </div>

          </div>

          <div className="footer-bottom">

            <span>
              © 2026 NewsHub. All rights
              reserved.
            </span>

            <span>
              Powered by GNews API
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default App;