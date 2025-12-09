import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./AllReports.css";

export default function AllReports() {
  const { ticker: tickerParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const ticker =
    tickerParam ||
    new URLSearchParams(location.search).get("ticker") ||
    null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL;

  

  // Normalize URLs: keep absolute URLs (Cloudinary) as-is, add BASE_URL to relative URLs
  const normalizeUrl = (u) => {
    if (!u) return null;
    u = u.trim();
    return u.startsWith("http") ? u : BASE_URL + (u.startsWith("/") ? "" : "/") + u;
  };

  useEffect(() => {
    if (!ticker) return;

    async function loadData() {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/company-reports/${ticker}/`);

        const formatted = {
          ...res.data,
          logo: normalizeUrl(res.data.logo),
          reports: (res.data.reports || []).map((r) => ({
            ...r,
            report_pdf: normalizeUrl(r.pdf_url),
            thumbnail_url: normalizeUrl(r.thumbnail_url),
          })),
        };

        setData(formatted);
      } catch (err) {
        console.error("Error fetching company:", err);
        setData(err.response?.status === 404 ? null : {});
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [ticker]);

  if (!ticker) return <p className="no-data-message">No ticker provided.</p>;
  if (loading) return <p className="loading-message">Loading…</p>;
  if (data === null) return <p className="no-data-message">Company not found.</p>;

  const {
    company_name,
    exchange,
    sector,
    industry,
    employee_count,
    address,
    description,
    social_links,
    logo,
    reports = [],
    report_message,
  } = data;

  // Most recent report
  const mostRecent = reports.length
    ? [...reports].sort((a, b) => (b.year || 0) - (a.year || 0))[0]
    : null;

  const remaining = mostRecent
    ? reports.filter((r) => r.id !== mostRecent.id)
    : reports;

  const MIN = 6;
  const visibleReports = showMore ? remaining : remaining.slice(0, MIN);

  return (
    <div className="page-container">
      {company_name ? (
        <h1 className="main-title">{company_name} ({ticker})</h1>
      ) : (
        <p className="no-data-message">Company info not available.</p>
      )}

      {company_name && (
        <CompanyInfoCard
          logo={logo}
          exchange={exchange}
          sector={sector}
          industry={industry}
          employee_count={employee_count}
          address={address}
          description={description}
          social_links={social_links}
        />
      )}

      {/* Most Recent Report */}
      {mostRecent ? (
        <MostRecentCard report={mostRecent} />
      ) : (
        <div className="no-reports-box">
          <h2>No Reports Available</h2>
          <p>{report_message || "This company does not have any uploaded reports."}</p>
        </div>
      )}

      {/* All Other Reports */}
      {remaining.length > 0 && (
        <>
          <h2 className="section-heading">All Reports</h2>
          <div className="reports-grid">
            {visibleReports.map((r) => (
              <ReportCard key={r.id || r.year} report={r} />
            ))}
          </div>

          {remaining.length > MIN && (
            <div className="show-more-container">
              <button className="btn-primary" onClick={() => setShowMore(!showMore)}>
                {showMore ? "Show Less" : "Show More Reports"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* -----------------------------------------------------
   SUB COMPONENTS
----------------------------------------------------- */

function CompanyInfoCard({
  logo,
  exchange,
  sector,
  industry,
  employee_count,
  address,
  description,
  social_links,
}) {
  const [expanded, setExpanded] = useState(false);

  const shortText = description?.length > 200
    ? description.slice(0, 200) + "..."
    : description;

  return (
    <div className="company-card">
      <img
        src={logo || "/fallback-logo.png"}
        alt="Company Logo"
        className="company-logo"
        style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "contain" }}
        onError={(e) => (e.target.src = "/fallback-logo.png")}
      />

      <div className="company-details">
        {exchange && <p><strong>Exchange:</strong> {exchange}</p>}
        {sector && <p><strong>Sector:</strong> {sector}</p>}
        {industry && <p><strong>Industry:</strong> {industry}</p>}
        {employee_count && <p><strong>Employees:</strong> {employee_count}</p>}
        {address && <p><strong>Address:</strong> {address}</p>}

        {description && (
          <div className="description-section">
            <strong>Description:</strong>
            <p>
              {expanded ? description : shortText}
              {description.length > 200 && (
                <span className="readmore-toggle" onClick={() => setExpanded(!expanded)}>
                  {expanded ? "Read Less" : "Read More"}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MostRecentCard({ report }) {
  if (!report) return null;

  return (
    <div className="recent-card">
      <img
        src={report.thumbnail_url || "/fallback-thumb.jpg"}
        alt="Recent Report"
        className="recent-thumb"
        style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
        onError={(e) => (e.target.src = "/fallback-thumb.jpg")}
      />

      <div>
        <h2>Most Recent Report</h2>
        <h3>{report.year} Annual Report</h3>

        <div className="button-row">
          <a href={report.report_pdf} target="_blank" rel="noreferrer">
            <button className="btn-primary">Open PDF</button>
          </a>
          <a href={report.report_pdf} download>
            <button className="btn-primary">Download</button>
          </a>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ report }) {

  const downloadFile = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", ""); // forces download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="report-card">
      <img
        src={report.thumbnail_url || "/fallback-thumb.jpg"}
        alt="Thumbnail"
        className="report-thumb"
        style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "cover" }}
        onError={(e) => (e.target.src = "/fallback-thumb.jpg")}
      />
      <h3 className="report-year">Year {report.year}</h3>

      <div className="button-row">
        <a href={report.report_pdf} target="_blank" rel="noreferrer">
          <button className="btn-small">Open</button>
        </a>

        {/* ✅ Fixed: use `report.report_pdf` instead of `item.pdf_url` */}
        <button
           onClick={() => {
    window.location.href = `http://127.0.0.1:8000/download-report/${report.id}/`;
  }}
          className="btn-small"
        >
          Download
        </button>
      </div>
    </div>
  );
}
