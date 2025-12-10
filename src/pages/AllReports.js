import { useParams} from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./AllReports.css";

export default function AllReports() {
  const { ticker: tickerParam, exchange: exchangeParam } = useParams();
  // const navigate = useNavigate();

  const ticker = tickerParam || null;
  const exchange = exchangeParam || null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL;

  // Normalize URL helper
  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      url = url.trim();
      if (url.startsWith("http")) return url;
      return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    },
    [BASE_URL]
  );

  // Fetch company + reports
  useEffect(() => {
    if (!ticker || !exchange) return;

    async function loadData() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/company-reports/${ticker}/${exchange}/`
        );

        const formattedReports = (res.data.reports || []).map((r) => ({
          ...r,
          report_pdf: normalizeUrl(r.pdf_url),
          thumbnail_url: normalizeUrl(r.thumbnail_url),
        }));

        setData({
          ...res.data,
          logo: normalizeUrl(res.data.logo),
          reports: formattedReports,
        });
      } catch (err) {
        console.error("Error fetching company reports:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [ticker, exchange, BASE_URL, normalizeUrl]);

  // Early returns
  if (!ticker || !exchange) return <p className="no-data-message">Invalid company request.</p>;
  if (loading) return <p className="loading-message">Loading…</p>;
  if (!data) return <p className="no-data-message">Company not found.</p>;

  const {
    company_name,
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

  const mostRecent = reports.length ? [...reports].sort((a, b) => (b.year || 0) - (a.year || 0))[0] : null;
  const remainingReports = mostRecent ? reports.filter((r) => r.id !== mostRecent.id) : reports;

  const MIN = 6;
  const visibleReports = showMore ? remainingReports : remainingReports.slice(0, MIN);

  return (
    <div className="page-container">
      <h1 className="main-title">
        {company_name} ({ticker}) - {exchange}
      </h1>

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

      {mostRecent ? (
        <MostRecentCard report={mostRecent} />
      ) : (
        <div className="no-reports-box">
          <h2>No Reports Available</h2>
          <p>{report_message || "This company does not have any reports."}</p>
        </div>
      )}

      {remainingReports.length > 0 && (
        <>
          <h2 className="section-heading">All Reports</h2>
          <div className="reports-grid">
            {visibleReports.map((r) => (
              <ReportCard key={r.id || r.year} report={r} />
            ))}
          </div>
          {remainingReports.length > MIN && (
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

/* ------------------------
   Sub Components
------------------------ */

// Company Info Card
function CompanyInfoCard({ logo, exchange, sector, industry, employee_count, address, description }) {
  const [expanded, setExpanded] = useState(false);
  const shortText = description && description.length > 200 ? description.slice(0, 200) + "..." : description;

  return (
    <div className="company-card">
      <img src={logo || "/fallback-logo.png"} alt="Logo" className="company-logo" onError={(e) => (e.target.src = "/fallback-logo.png")} />
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
                  {expanded ? " Read Less" : " Read More"}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Most Recent Report Card
function MostRecentCard({ report }) {
  if (!report) return null;

  return (
    <div className="recent-card">
      <img src={report.thumbnail_url || "/fallback-thumb.jpg"} alt="Thumbnail" className="recent-thumb" onError={(e) => (e.target.src = "/fallback-thumb.jpg")} />
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

// Individual Report Card
function ReportCard({ report }) {
  const downloadFile = () => {
    if (report.id) {
      window.location.href = `${process.env.REACT_APP_API_URL}/download-report/${report.id}/`;
    }
  };

  return (
    <div className="report-card">
      <img src={report.thumbnail_url || "/fallback-thumb.jpg"} alt="Report" className="report-thumb" onError={(e) => (e.target.src = "/fallback-thumb.jpg")} />
      <h3 className="report-year">Year {report.year}</h3>
      <div className="button-row">
        {report.report_pdf && (
          <a href={report.report_pdf} target="_blank" rel="noreferrer">
            <button className="btn-small">Open</button>
          </a>
        )}
        <button className="btn-small" onClick={downloadFile}>Download</button>
      </div>
    </div>
  );
}
