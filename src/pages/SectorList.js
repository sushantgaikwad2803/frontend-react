import React from "react";
import { useNavigate } from "react-router-dom";
import "./SectorList.css";

export default function SectorList() {
  const navigate = useNavigate();

  const sectorSystems = {
    "GICS": [
      "Energy",
      "Materials",
      "Industrials",
      "Consumer Discretionary",
      "Consumer Staples",
      "Health Care",
      "Financials",
      "Information Technology",
      "Communication Services",
      "Utilities",
      "Real Estate",
    ],
    "ICB": [
      "Oil & Gas",
      "Basic Materials",
      "Industrials",
      "Consumer Goods",
      "Health Care",
      "Consumer Services",
      "Telecommunications",
      "Utilities",
      "Financials",
      "Technology",
      "Real Estate",
    ],
    "BICS": [
      "Communication Services",
      "Consumer Discretionary",
      "Consumer Staples",
      "Energy",
      "Financials",
      "Health Care",
      "Industrials",
      "Information Technology",
      "Materials",
      "Real Estate",
      "Utilities",
      "Other",
    ],
    "TRBC": [
      "Energy",
      "Basic Materials",
      "Consumer Cyclicals",
      "Consumer Non-Cyclicals",
      "Financials",
      "Healthcare",
      "Industrials",
      "Technology",
      "Telecommunications Services",
      "Utilities",
    ],
    "NAICS": [
      "Agriculture, Forestry, Fishing and Hunting",
      "Mining, Quarrying, and Oil and Gas Extraction",
      "Utilities",
      "Construction",
      "Manufacturing",
      "Wholesale Trade",
      "Retail Trade",
      "Transportation and Warehousing",
      "Information",
      "Finance and Insurance",
      "Real Estate and Rental and Leasing",
      "Professional, Scientific, and Technical Services",
      "Management of Companies and Enterprises",
      "Administrative and Support and Waste Management Services",
      "Educational Services",
      "Health Care and Social Assistance",
      "Arts, Entertainment, and Recreation",
      "Accommodation and Food Services",
      "Other Services (except Public Administration)",
      "Public Administration",
    ],
    "SIMPLE": [
      "Technology",
      "Health Care",
      "Financials",
      "Consumer Discretionary",
      "Consumer Staples",
      "Industrials",
      "Energy",
      "Utilities",
      "Real Estate",
      "Materials",
      "Communication Services",
      "Conglomerates",
    ],
  };

  function openSector(sectorName, systemName) {
    const encodedSector = encodeURIComponent(sectorName);
    const encodedSystem = encodeURIComponent(systemName);
    navigate(`/companies/sector/${encodedSector}?system=${encodedSystem}`);
  }

  return (
    <div className="sector-container">
      <h1 className="sector-title">Sector Classifications</h1>
      <p className="sector-subtitle">Browse all sector classifications from different systems</p>

      <div className="sector-systems-container">
        {Object.entries(sectorSystems).map(([systemName, sectors]) => (
          <div key={systemName} className="system-section">
            <div className="system-header">
              <h2 className="system-name">{systemName}</h2>
              <span className="sector-count">{sectors.length} sectors</span>
            </div>
            
            <div className="sector-grid">
              {sectors.map((sector) => (
                <button
                  key={`${systemName}-${sector}`}
                  className="sector-card"
                  onClick={() => openSector(sector, systemName)}
                  title={`View ${sector} companies (${systemName} system)`}
                >
                  <span className="sector-name">{sector}</span>
                  <span className="system-badge">{systemName}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
