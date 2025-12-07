import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Filter.css";

/* ------------------ IMPORT EXCHANGE LOGOS ------------------ */
import slid1 from '../media/AIM.png';
import slid2 from '../media/AMEX.png';
import slid3 from '../media/asx.jpg';
import slid4 from '../media/lse.jpg';
import slid5 from '../media/NASDAQ.png';
import slid6 from '../media/NYSE.png';
import slid7 from '../media/OTC.png';
import slid8 from '../media/TSX-V.png';
import slid9 from '../media/tsx.jpg';

/* ------------------ SECTOR SYSTEMS ------------------ */
const SYSTEMS = {
  GICS: [
    "Energy", "Materials", "Industrials", "Consumer Discretionary",
    "Consumer Staples", "Health Care", "Financials",
    "Information Technology", "Communication Services",
    "Utilities", "Real Estate"
  ],

  ICB: [
    "Oil & Gas", "Basic Materials", "Industrials", "Consumer Goods",
    "Health Care", "Consumer Services", "Telecommunications",
    "Utilities", "Financials", "Technology", "Real Estate"
  ],

  BICS: [
    "Communication Services", "Consumer Discretionary", "Consumer Staples",
    "Energy", "Financials", "Health Care", "Industrials",
    "Information Technology", "Materials", "Real Estate",
    "Utilities", "Other"
  ],

  TRBC: [
    "Energy", "Basic Materials", "Consumer Cyclicals",
    "Consumer Non-Cyclicals", "Financials", "Healthcare",
    "Industrials", "Technology", "Telecommunications Services",
    "Utilities"
  ],

  NAICS: [
    "Agriculture, Forestry, Fishing and Hunting",
    "Mining, Quarrying, and Oil and Gas Extraction",
    "Utilities", "Construction", "Manufacturing", "Wholesale Trade",
    "Retail Trade", "Transportation and Warehousing", "Information",
    "Finance and Insurance", "Real Estate and Rental and Leasing",
    "Professional, Scientific, and Technical Services",
    "Management of Companies and Enterprises",
    "Administrative and Support and Waste Management Services",
    "Educational Services", "Health Care and Social Assistance",
    "Arts, Entertainment, and Recreation",
    "Accommodation and Food Services",
    "Other Services (except Public Administration)",
    "Public Administration"
  ],

  SIMPLE: [
    "Technology", "Health Care", "Financials", "Consumer Discretionary",
    "Consumer Staples", "Industrials", "Energy", "Utilities",
    "Real Estate", "Materials", "Communication Services", "Conglomerates"
  ],
};

/* ------------------ EXCHANGES ------------------ */
const EXCHANGES = [
  { id: 1, name: "AIM", src: slid1 },
  { id: 2, name: "AMEX", src: slid2 },
  { id: 3, name: "ASX", src: slid3 },
  { id: 4, name: "LSE", src: slid4 },
  { id: 5, name: "NASDAQ", src: slid5 }, 
  { id: 6, name: "NYSE", src: slid6 },
  { id: 7, name: "OTC", src: slid7 },
  { id: 8, name: "TSX-V", src: slid8 },
  { id: 9, name: "TSX", src: slid9 },
];

const ALPHABETS = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

/* -------------------------------------------------------- */

export default function OtherFilter() {
  const navigate = useNavigate();
  const [currentSystem, setCurrentSystem] = useState("GICS");

  const selectedSectors = SYSTEMS[currentSystem];


  return (
    <div className="filterPage-container">

      <h1 className="filterPage-title">Other Filters</h1>

      {/* ---- 3 Columns Row ---- */}
      <div className="filterPage-row">

        {/* ========== SECTOR ========== */}
        <section className="filterPage-section">
          <h2 className="filterPage-heading">Filter by Sector</h2>

          <div className="filterPage-dropdownRow">
            <label className="filterPage-label">Select System:</label>

            <select
              className="filterPage-systemSelect"
              value={currentSystem}
              onChange={(e) => setCurrentSystem(e.target.value)}
            >
              {Object.keys(SYSTEMS).map((sys) => (
                <option key={sys} value={sys}>{sys}</option>
              ))}
            </select>
          </div>

          <div className="filterPage-grid">
            {selectedSectors.map((sector) => (
              <button
                key={sector}
                className="filterPage-sectorBtn"
                onClick={() =>
                  navigate(`/AllCompanies?sector=${encodeURIComponent(sector)}`)
                }
              >
                {sector}
              </button>
            ))}
          </div>
        </section>

        {/* ========== EXCHANGE ========== */}
        <section className="filterPage-section">
          <h2 className="filterPage-heading">Filter by Exchange</h2>

          <div className="filterPage-exchangeGrid">
            {EXCHANGES.map((ex) => (
              <div
                key={ex.id}
                className="filterPage-exchangeCard"
                onClick={() =>
                  navigate(`/AllCompanies?exchange=${encodeURIComponent(ex.name)}`) 
                }
              >
                <img src={ex.src} alt={ex.name} className="filterPage-exchangeLogo" />
                <p className="filterPage-exchangeName">{ex.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========== ALPHABET ========== */}
        <section className="filterPage-section">
          <h2 className="filterPage-heading">Filter by Alphabet</h2>

          <div className="filterPage-alphabetRow">
            {ALPHABETS.map((letter) => (
              <button
                key={letter}
                className="filterPage-alphaBtn"
                onClick={() => navigate(`/AllCompanies?alpha=${letter}`)}
              >
                {letter}
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
