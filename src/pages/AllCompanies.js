import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "./AllCompanies.css";

export default function AllCompanies() {
  const navigate = useNavigate();

  const params = useParams();

  const routeSector = params.sector || "";
  const routeExchange = params.exchange || "";
  const routeAlpha = params.alpha || "";
  const routeSearch = params.query || "";

  const finalSector = routeSector;
  const finalExchange = routeExchange;
  const finalAlpha = routeAlpha.toUpperCase();
  const finalSearch = routeSearch.toLowerCase();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE = process.env.REACT_APP_API_URL;

  const filterCompanies = useCallback(
    (list) => {
      let filtered = [...list];

      if (finalSector) {
        filtered = filtered.filter(
          (c) =>
            c.sector &&
            c.sector.toLowerCase().trim() === finalSector.toLowerCase().trim()
        );
      }

      if (finalExchange) {
        filtered = filtered.filter(
          (c) =>
            c.exchange &&
            c.exchange.toLowerCase().trim() === finalExchange.toLowerCase().trim()
        );
      }

      if (finalAlpha) {
        filtered = filtered.filter((c) => c.name?.toUpperCase().startsWith(finalAlpha));
      }

      if (finalSearch) {
        filtered = filtered.filter(
          (c) =>
            (c.name || "").toLowerCase().includes(finalSearch) ||
            (c.ticker || "").toLowerCase().includes(finalSearch)
        );
      }

      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      return filtered;
    },
    [finalSector, finalExchange, finalAlpha, finalSearch]
  );

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const response = await axios.get(`${BASE}/api/companies/`);
        const list = response.data?.companies || [];

        const filtered = filterCompanies(list);
        setCompanies(filtered);

      } catch (err) {
        console.error("Error loading companies:", err);
        setCompanies([]);
      }

      setLoading(false);
    }

    loadData();
  }, [BASE, filterCompanies]);


  // useEffect(() => {
  //   async function loadData() {
  //     setLoading(true);

  //     try {
  //       let url = `${BASE}/api/companies/?`;

  //       if (finalSector) url += `sector=${finalSector}&`;
  //       if (finalExchange) url += `exchange=${finalExchange}&`;
  //       if (finalAlpha) url += `alpha=${finalAlpha}&`;
  //       if (finalSearch) url += `search=${finalSearch}&`;

  //       console.log("API URL:", url); // debug

  //       const response = await axios.get(url);
  //       const list = response.data?.companies || [];

  //       setCompanies(list);

  //     } catch (err) {
  //       console.error("Error loading companies:", err);
  //       setCompanies([]);
  //     }

  //     setLoading(false);
  //   }

  //   loadData();
  // }, [BASE, finalSector, finalExchange, finalAlpha, finalSearch]);

  const openCompanyReports = (company) => {
    if (!company?.ticker || !company?.exchange) return;

    const slug = `${company.name}-${company.ticker}`
      .toLowerCase()
      .replace(/\s+/g, "-");

    navigate(`/company/${slug}/${company.exchange}`);
  };

  if (loading) return <div className="loading-message">Fetching companies...</div>;

  return (
    <>
      <Helmet>
        <title>
          {finalSector
            ? `${finalSector} Companies List`
            : finalExchange
              ? `${finalExchange} Listed Companies`
              : finalAlpha
                ? `Companies Starting with ${finalAlpha}`
                : finalSearch
                  ? `Search results for ${finalSearch}`
                  : "All Companies List"}
        </title>

        <meta
          name="description"
          content={`Browse ${finalSector || finalExchange || finalAlpha || finalSearch || "global"
            } companies with financial reports, financial data, and investor insights.`}
        />

        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="page-container">
        <h1 className="page-title">
          {finalSector && (
            <>
              Companies in <span className="highlight">{finalSector}</span>
            </>
          )}
          {finalAlpha && (
            <>
              Starting with <span className="highlight">{finalAlpha}</span>
            </>
          )}
          {finalExchange && (
            <>
              Listed on <span className="highlight">{finalExchange}</span>
            </>
          )}
          {!finalSector && !finalAlpha && !finalExchange && !finalSearch && "All Companies"}
          {finalSearch && (
            <>
              Search results for <span className="highlight">{finalSearch}</span>
            </>
          )}
        </h1>

        {companies.length === 0 ? (
          <p className="no-results-message">No companies found.</p>
        ) : (
          <div className="table-container">
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
                    onClick={() => openCompanyReports(c)}
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
          </div>
        )}
      </div>
    </>
  );

}
