import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './RandomReport.css';

export default function RandomReport() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
   const BASE = process.env.REACT_APP_API_URL; // Your Django backend

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get(`${BASE}/random-company-report/`);
        const list = res.data.results || [];

        const processed = list.map(item => {
          const company = item.company || {};
          const report = item.report || null;

          let thumbnail_url = null;
          let report_pdf = null;
          let year = null;

          if (report) {
            year = report.year || null;

            // Only set thumbnail_url if it exists
            if (report.thumbnail_url && report.thumbnail_url.trim() !== "") {
              thumbnail_url = report.thumbnail_url.startsWith("http")
                ? report.thumbnail_url
                : `${BASE}${report.thumbnail_url.startsWith("/") ? "" : "/"}${report.thumbnail_url}`;
            }

            // Only set report PDF if it exists
            if (report.pdf_url && report.pdf_url.trim() !== "") {
              report_pdf = report.pdf_url.startsWith("http")
                ? report.pdf_url
                : `${BASE}${report.pdf_url.startsWith("/") ? "" : "/"}${report.pdf_url}`;
            }
          }

          return { company, report: { ...report, report_pdf, year }, thumbnail_url };
        });

        setItems(processed);
      } catch (err) {
        console.error("Random report load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div className="loading-message">Fetching random reports… 🔄</div>;
  }

  return (
    <div className="random-report-container">
      <h2 className="report-list-heading">Company Reports</h2>
      <div className="report-grid">
        {items.map((item, idx) => {
          const { company, report, thumbnail_url } = item;
          const hasReport = report !== null;

          return (
            <div key={idx} className="report-card">
              <div>
                <h3 className="company-name">{company.name || "Unnamed Co."}</h3>
                <p>{company.sector || "Sector not available"}</p>
                <p>{hasReport && report.year ? report.year : "No report available"}</p>

                {hasReport && thumbnail_url ? (
                  <img
                    src={thumbnail_url}
                    alt={`${company.name} report`}
                    className="report-thumbnail"
                    onError={(e) => (e.target.src = "/fallback-thumb.jpg")}
                  />
                ) : (
                  <div className="thumbnail-placeholder">
                    No Thumbnail
                  </div>
                )}
              </div>

              <div className="card-actions">
                <button
                  onClick={() => navigate(`/company-reports/${company.ticker}`)}
                  className="btn-view-company"
                >
                  View Reports
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

