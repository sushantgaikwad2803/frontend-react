import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './RandomReport.css'; // Import the CSS file

export default function RandomReport() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const BASE = "http://127.0.0.1:8000";
  
  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get(`${BASE}/random-company-report/`);
        const list = res.data.results || [];

        const processed = await Promise.all(
          list.map(async (item) => {
            const company = item.company || {};
            const report = item.report || null; 

            // If no report, return early
            if (!report || !report.id) {
              return { company, report: null, thumbnail_url: null };
            }

            try {
              const preview = await axios.get(
                `${BASE}/pdf-first-page/${report.id}/`
              );

              // Backend may return relative OR absolute
              let thumb = preview.data.thumbnail_url || null;
              if (thumb && !thumb.startsWith("http")) {
                thumb = BASE + thumb;
              }

              // Normalize report PDF
              let pdf = report.report_pdf;
              if (pdf && !pdf.startsWith("http")) pdf = BASE + pdf;

              return {
                company,
                report: { ...report, report_pdf: pdf },
                thumbnail_url: thumb,
              };
            } catch (err) {
              console.warn("Preview not available:", err);
              return { company, report, thumbnail_url: null };
            }
          })
        );

        setItems(processed);
      } catch (err) {
        console.error("Random report load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /* ---------------- LOADING --------------- */
  if (loading) {
    return (
      <div className="loading-message">
        Fetching random sparks… 🔄
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="random-report-container">
      <h2 className="report-list-heading">
        Company Reports
      </h2>

      <div className="report-grid">
        {items.map((item, idx) => {
          const { company, report, thumbnail_url } = item;
          const hasReport = report !== null;

          return (
            <div
              key={idx}
              className="report-card"
            >
              <div>
                <h3 className="company-name">
                  {company.name || "Unnamed Co."} 
                </h3>

                <p>{company.sector}</p>
                <p>
                  {" "}
                  {hasReport ? report.year : "No report available"} 
                </p>

                {/* Thumbnail (if available) */}
                {hasReport && thumbnail_url && (
                  <img
                    src={thumbnail_url}
                    alt="Report preview"
                    className="report-thumbnail"
                    onError={(e) => (e.target.src = "/fallback-thumb.jpg")}
                  />
                )}
              </div>

              {/* ACTION BUTTONS */}
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