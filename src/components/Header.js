import React, { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faChevronDown,
  faChevronUp,
  faTimes,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Header.css";

/* ============================================================================
   1. Browse Menu Component
   ============================================================================ */
const BrowseMenu = React.memo(({ closeMobileMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    if (closeMobileMenu) closeMobileMenu();
  }, [closeMobileMenu]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeMenu]);

  const categories = [
    { id: "Sector", name: "Sector", route: "/sectorslist" },
    // { id: "apparel", name: "Apparel & Fashion", route: "#apparel" },
    { id: "Other Filter", name: "Other Filter", route: "/OtherFilter" },
  ];

  return (
    <div className="browse-by-container" ref={menuRef}>
      <button
        className={`browse-by-button ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-expanded={isOpen}
      >
        Browse Categories
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="dropdown-arrow"
        />
      </button>

      {isOpen && (
        <ul className="browse-by-dropdown">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                className="browse-link-btn"
                onClick={() => {
                  if (cat.route.startsWith("/")) navigate(cat.route);
                  closeMenu();
                }}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

/* ============================================================================
   2. Search Bar Component
   ============================================================================ */
const SearchBar = React.memo(({ isSearchOpen, closeSearchBar, searchRef }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/AllCompanies?search=${encodeURIComponent(searchQuery.trim())}`);
    closeSearchBar();
  };

  return (
    isSearchOpen && (
      <div className="search-bar-after-header" ref={searchRef}>
        <div className="search-bar-container">
          <form onSubmit={submitSearch} className="search-bar-form">
            <div className="search-input-group">
              <div className="search-input-wrapper">
                <FontAwesomeIcon icon={faSearch} className="search-input-icon" />
                <input
                  type="text"
                  placeholder="Search company or ticker..."
                  className="search-input-field"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <button type="submit" className="search-submit-btn">
                Search
              </button>

              <button
                type="button"
                className="search-close-btn"
                onClick={closeSearchBar}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
});

/* ============================================================================
   3. Main Header Component
   ============================================================================ */
const Header = () => {
  const navigate = useNavigate();

  const [cartItemCount] = useState(3);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const closeSearchBar = useCallback(() => setIsSearchOpen(false), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const toggleSearchBar = () => {
    setIsSearchOpen((prev) => !prev);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const globalHandler = (event) => {
      const clickSearchIcon = event.target.closest(".search-icon-button");
      const clickMenuIcon = event.target.closest(".menu-toggle-button");

      if (
        isSearchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !clickSearchIcon
      ) {
        closeSearchBar();
      }

      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !clickMenuIcon
      ) {
        closeMobileMenu();
      }
    };

    const escapeHandler = (e) => {
      if (e.key === "Escape") {
        closeSearchBar();
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", globalHandler);
    document.addEventListener("keydown", escapeHandler);

    return () => {
      document.removeEventListener("mousedown", globalHandler);
      document.removeEventListener("keydown", escapeHandler);
    };
  }, [isSearchOpen, isMobileMenuOpen, closeSearchBar, closeMobileMenu]);

  return (
    <div className="header-wrapper">
      <header className="ecom-header-container">
        {/* LOGO with navigate("/") */}
        <div
          className="logo-section"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src="../media/AIM.png" alt="Logo" className="shop-logo" />
        </div>

        <nav className="nav-and-actions">
          <div className="desktop-nav-links">
            <BrowseMenu />
          </div>

          <div className="action-buttons">
            <button
              className={`menu-toggle-button mobile-only-icon ${
                isMobileMenuOpen ? "active" : ""
              }`}
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
            </button>

            <div className="search-toggle-container">
              <button
                className={`search-icon-button ${
                  isSearchOpen ? "active" : ""
                }`}
                onClick={toggleSearchBar}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>

            <button className="cart-button matching-color">
              <FontAwesomeIcon icon={faShoppingCart} />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" ref={mobileMenuRef}>
          <div className="mobile-menu-content">
            <BrowseMenu closeMobileMenu={closeMobileMenu} />
          </div>
        </div>
      )}

      <SearchBar
        isSearchOpen={isSearchOpen}
        closeSearchBar={closeSearchBar}
        searchRef={searchRef}
      />
    </div> 
  );
};

export default Header;
