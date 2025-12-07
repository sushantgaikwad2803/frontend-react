import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./AllCompanies.css";

export default function AllCompanies() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // ------------------------------
  // ROUTE PARAMS
  // ------------------------------
  const routeSector = params.sector || "";
  const routeExchange = params.exchange || "";
  const routeAlpha = params.alpha || "";

  // ------------------------------
  // QUERY PARAMS
  // ------------------------------
  const query = new URLSearchParams(location.search);
  const qSector = query.get("sector");
  const qAlpha = query.get("alpha");
  const qExchange = query.get("exchange");
  const qSearch = query.get("search");

  // ------------------------------
  // FINAL FILTER VALUES
  // ------------------------------
  const finalSector = routeSector || qSector || "";
  const finalAlpha = (routeAlpha || qAlpha || "").toUpperCase();
  const finalExchange = routeExchange || qExchange || "";
  const finalSearch = qSearch ? qSearch.toLowerCase() : "";

  // ------------------------------
  // STATE
  // ------------------------------
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // IMPORTANT: Your laptop IP (works on mobile)
  const BASE = "http://127.0.0.1:8000";

  // ------------------------------
  // FETCH COMPANIES
  // ------------------------------
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const response = await axios.get(`${BASE}/api/companies/`);
        let list = response.data?.companies || [];

        // --------------------------
        // FILTERS
        // --------------------------

        // Sector
        if (finalSector) {
          list = list.filter(
            (c) =>
              c.sector &&
              c.sector.toLowerCase().trim() === finalSector.toLowerCase().trim()
          );
        }

        // Exchange
        if (finalExchange) {
          list = list.filter(
            (c) =>
              c.exchange &&
              c.exchange.toLowerCase().trim() === finalExchange.toLowerCase().trim()
          );
        }

        // Alphabet filter
        if (finalAlpha) {
          list = list.filter((c) =>
            c.name?.toUpperCase().startsWith(finalAlpha)
          );
        }

        // Search filter
        if (finalSearch) {
          list = list.filter(
            (c) =>
              c.name.toLowerCase().includes(finalSearch) ||
              c.ticker.toLowerCase().includes(finalSearch)
          );
        }

        // Alphabetical sort
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

        setCompanies(list);
      } catch (err) {
        console.error("Error loading companies:", err);
      }

      setLoading(false);
    }

    loadData();
  }, [finalSector, finalAlpha, finalExchange, finalSearch]);

  // ------------------------------
  // OPEN COMPANY REPORT PAGE
  // ------------------------------
  const openCompanyReports = (ticker) => {
    navigate(`/company-reports/${ticker}`);
  };

  // ------------------------------
  // RENDER
  // ------------------------------
  if (loading) {
    return <div className="loading-message">Fetching companies...</div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">
        {finalSector && <>Companies in <span className="highlight">{finalSector}</span></>}
        {finalAlpha && <>Starting with <span className="highlight">{finalAlpha}</span></>}
        {finalExchange && <>Listed on <span className="highlight">{finalExchange}</span></>}
        {!finalSector && !finalAlpha && !finalExchange && !finalSearch && "All Companies"}
        {finalSearch && <>Search results for <span className="highlight">{finalSearch}</span></>}
      </h1>

      {companies.length === 0 ? (
        <p className="no-results-message">No companies found.</p>
      ) : (
        <table className="companies-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Ticker</th>
              <th>Sector</th>
              <th>Industry</th>
              <th>Exchange</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((c) => (
              <tr
                key={c.id}
                className="table-row"
                onClick={() => openCompanyReports(c.ticker)}
              >
                <td data-label="Name">{c.name}</td>
                <td data-label="Ticker">{c.ticker}</td>
                <td data-label="Sector">{c.sector}</td>
                <td data-label="Industry">{c.industry}</td>
                <td data-label="Exchange">{c.exchange}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
