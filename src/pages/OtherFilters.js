// import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./OtherFilters.css";

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
  { id: 1, name: "AIM", src: slid1, symbol: "LSE:AIM" },
  { id: 2, name: "AMEX", src: slid2, symbol: "NYSE:AMEX" },
  { id: 3, name: "ASX", src: slid3, symbol: "ASX" },
  { id: 4, name: "LSE", src: slid4, symbol: "LON" },
  { id: 5, name: "NASDAQ", src: slid5, symbol: "NASDAQ" },
  { id: 6, name: "NYSE", src: slid6, symbol: "NYSE" },
  { id: 7, name: "OTC", src: slid7, symbol: "OTC" },
  { id: 8, name: "TSX-V", src: slid8, symbol: "TSXV" },
  { id: 9, name: "TSX", src: slid9, symbol: "TSX" },
];

const ALPHABETS = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

/* -------------------------------------------------------- */

export default function OtherFilter() {
  const navigate = useNavigate();
  const [currentSystem, setCurrentSystem] = useState("GICS");
  const [activeTab, setActiveTab] = useState("sector");
  const [selectedLetter, setSelectedLetter] = useState("");

  const selectedSectors = SYSTEMS[currentSystem];
  const totalCompanies = 12560; // Example count
  const totalSectors = selectedSectors.length;
  const totalExchanges = EXCHANGES.length;

  const SYSTEM_DESCRIPTIONS = {
    GICS: "Global Industry Classification Standard",
    ICB: "Industry Classification Benchmark",
    BICS: "Bloomberg Industry Classification System",
    TRBC: "The Refinitiv Business Classification",
    NAICS: "North American Industry Classification System",
    SIMPLE: "Simplified Sector Classification"
  };

  // const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);

  const routeSector = params.sector || "";
  const routeExchange = params.exchange || "";
  const routeAlpha = params.alpha || "";

  const qSector = query.get("sector") || "";
  const qExchange = query.get("exchange") || "";
  const qAlpha = query.get("alpha") || "";
  const qSearch = query.get("search") || "";

  const finalSector = routeSector || qSector;
  const finalExchange = routeExchange || qExchange;
  const finalAlpha = (routeAlpha || qAlpha).toUpperCase();
  const finalSearch = qSearch.toLowerCase();

  const [, setCompanies] = useState([]);
  const [, setLoading] = useState(false);

  const BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
  
      try {
        let url = `${BASE}/api/companies/?`;
  
        if (finalSector) url += `sector=${finalSector}&`;
        if (finalExchange) url += `exchange=${finalExchange}&`;
        if (finalAlpha) url += `alpha=${finalAlpha}&`;
        if (finalSearch) url += `search=${finalSearch}&`;
  
        const response = await axios.get(url);
  
        const list = response.data?.companies || [];
        setCompanies(list);
  
      } catch (err) {
        console.error("Error:", err);
        setCompanies([]);
      }
  
      setLoading(false);
    }
  
    loadData();
  }, [BASE, finalSector, finalExchange, finalAlpha, finalSearch]);

  return (
    <div className="other-filter-container">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="other-title">Advanced Filters</h1>
        <p className="page-subtitle">
          Filter companies by sector, exchange, or alphabetical order. 
          Select any filter to view companies in that category.
        </p>
      </header>

      {/* Tabs Navigation */}
      <div className="filter-tabs">
        <button 
          className={`tab-btn ${activeTab === 'sector' ? 'active' : ''}`}
          onClick={() => setActiveTab('sector')}
        >
          <span className="tab-icon">🏢</span>
          By Sector
        </button>
        
        <button 
          className={`tab-btn ${activeTab === 'exchange' ? 'active' : ''}`}
          onClick={() => setActiveTab('exchange')}
        >
          <span className="tab-icon">🏛️</span>
          By Exchange
        </button>
        
        <button 
          className={`tab-btn ${activeTab === 'alphabet' ? 'active' : ''}`}
          onClick={() => setActiveTab('alphabet')}
        >
          <span className="tab-icon">🔤</span>
          By Alphabet
        </button>
      </div>

      {/* Sector Tab Content */}
      <div className={`tab-content ${activeTab === 'sector' ? 'active' : ''}`}>
        <div className="system-selector-wrapper">
          <div className="system-header">
            <div className="system-info">
              <h3>{currentSystem} Classification</h3>
              <p>{SYSTEM_DESCRIPTIONS[currentSystem]}</p>
            </div>
            <div className="system-dropdown">
              <select
                className="system-select"
                value={currentSystem}
                onChange={(e) => setCurrentSystem(e.target.value)}
              >
                {Object.keys(SYSTEMS).map((sys) => (
                  <option key={sys} value={sys}>{sys}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="sector-grid-modern">
            {selectedSectors.map((sector, index) => (
              <div
                key={sector}
                className="sector-card-modern"
                onClick={() => navigate(`/sector/${encodeURIComponent(sector.toLowerCase())}`)}
                style={{ '--i': index }}
              >
                <h4>{sector}</h4>
                <div className="sector-count">
                  <span>📊</span>
                  <span>View Companies</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exchange Tab Content */}
      <div className={`tab-content ${activeTab === 'exchange' ? 'active' : ''}`}>
        <div className="exchange-grid-modern">
          {EXCHANGES.map((exchange, index) => (
            <div
              key={exchange.id}
              className="exchange-card-modern"
              onClick={() => navigate(`/exchange/${encodeURIComponent(exchange.name)}`)}
              style={{ '--i': index }}
            >
              <div className="exchange-logo-wrapper">
                <img src={exchange.src} alt={exchange.name} className="exchange-logo" />
              </div>
              <h3 className="exchange-name">{exchange.name}</h3>
              <p className="exchange-symbol">{exchange.symbol}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alphabet Tab Content */}
      <div className={`tab-content ${activeTab === 'alphabet' ? 'active' : ''}`}>
        <div className="alphabet-filter">
          <div className="alphabet-header">
            <h3>Filter by Company Name</h3>
            <p>Click on any letter to view companies starting with that letter</p>
          </div>
          
          <div className="alphabet-grid">
            {ALPHABETS.map((letter, index) => (
              <div
                key={letter}
                className={`letter-card ${selectedLetter === letter ? 'active' : ''}`}
                onClick={() => {
                  setSelectedLetter(letter);
                  navigate(`/alpha/${letter.toLowerCase()}`);
                }}
                style={{ '--i': index }}
              >
                {letter}
              </div>
            ))}
          </div>
  
        </div>
      </div>

      {/* Stats Panel */}
      <div className="stats-panel">
        <div className="stat-item">
          <div className="stat-value">{totalCompanies.toLocaleString()}</div>
          <div className="stat-label">Total Companies</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalSectors}</div>
          <div className="stat-label">Available Sectors</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalExchanges}</div>
          <div className="stat-label">Stock Exchanges</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{ALPHABETS.length}</div>
          <div className="stat-label">Alphabet Groups</div>
        </div>
      </div>
    </div>
  );
}
