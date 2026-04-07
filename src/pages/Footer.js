import React from "react";
import "./Footer.css";
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaYoutube,
//   FaInstagram,
//   FaLinkedin,
// } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h3>AnnualReports</h3>
          <p>
            Your gateway to annual reports, quarterly filings, investor documents,
            and global financial insights.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a></li>
            <li>
              <a href="/sectorslist" onClick={(e) => { e.preventDefault(); navigate("/sectorslist"); }}>
                Sector
              </a>
            </li>
            <li>
              <a href="/OtherFilter" onClick={(e) => { e.preventDefault(); navigate("/OtherFilter"); }}>
                Other Filter
              </a>
            </li>
            <li>
              <a href="/contact" onClick={(e) => { e.preventDefault(); navigate("/contact"); }}>
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section support">
          <h4>Support</h4>
          <ul>
            {/* <li onClick={() => navigate("/privacy")}><a>Privacy Policy</a></li> */}
            <li>
              <a href="/terms" onClick={(e) => { e.preventDefault(); navigate("/terms"); }}>
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="/faq" onClick={(e) => { e.preventDefault(); navigate("/faq"); }}>
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        {/* <div className="footer-section social">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div> */}
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AnnualReports — All Rights Reserved.</p>
      </div>
    </footer>
  );
}
