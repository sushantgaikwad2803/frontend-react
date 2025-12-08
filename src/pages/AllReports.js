// import { useParams, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./AllReports.css";

// export default function AllReports() {
//   const { ticker: tickerParam } = useParams();
//   const location = useLocation();

//   const ticker =
//     tickerParam ||
//     new URLSearchParams(location.search).get("ticker") ||
//     null; 

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showMore, setShowMore] = useState(false);

//   const BASE_URL = "http://127.0.0.1:8000";

//   // Normalize backend paths
//   const normalizeUrl = (path) =>
//     path ? (path.startsWith("http") ? path : BASE_URL + path) : null;

//   // Force PDF download
//   const forceDownload = async (url, filename) => {
//     try {
//       const res = await fetch(url);
//       const blob = await res.blob();
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = filename;
//       link.click();
//     } catch (err) {
//       console.error("Download failed:", err);
//     }
//   };

//   useEffect(() => {
//     if (!ticker) return;

//     async function loadData() {
//       try {
//         setLoading(true);

//         const res = await axios.get(`${BASE_URL}/company-reports/${ticker}/`);
//         const formatted = await formatCompany(res.data);
//         setData(formatted);
//       } catch (err) {
//         console.error("Error loading:", err);
//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     async function getThumbnail(id) {
//       try {
//         const r = await axios.get(`${BASE_URL}/pdf-first-page/${id}/`);
//         return normalizeUrl(r.data.thumbnail_url);
//       } catch {
//         return null;
//       }
//     }

//     async function formatCompany(raw) {
//       const reports = await Promise.all(
//         (raw.reports || []).map(async (r) => ({
//           ...r,
//           report_pdf: normalizeUrl(r.report_pdf),
//           thumbnail_url: await getThumbnail(r.id),
//         }))
//       );

//       return {
//         ...raw,
//         logo: normalizeUrl(raw.logo),
//         reports,
//       };
//     }

//     loadData();
//   }, [ticker]);

//   if (!ticker) return <p className="no-data-message">No ticker provided.</p>;
//   if (loading) return <p className="loading-message">Loading…</p>;
//   if (!data) return <p className="no-data-message">No data found.</p>;

//   const {
//     company_name,
//     exchange,
//     sector,
//     industry,
//     employee_count,
//     address,
//     description,
//     social_links,
//     logo,
//     reports = [],
//   } = data;

//   // ---------------------------
//   // REMOVE MOST RECENT FROM LIST
//   // ---------------------------
//   const mostRecent = [...reports].sort((a, b) => b.year - a.year)[0];
//   const filteredReports = reports.filter((r) => r.id !== mostRecent?.id);

//   const MIN = 6;
//   const visibleReports = showMore
//     ? filteredReports
//     : filteredReports.slice(0, MIN);

//   return (
//     <div className="page-container">
//       <h1 className="main-title">
//         {company_name} ({ticker})
//       </h1>

//       <CompanyInfoCard
//         logo={logo}
//         exchange={exchange}
//         sector={sector}
//         industry={industry}
//         employee_count={employee_count}
//         address={address}
//         description={description}
//         social_links={social_links}
//       />

//       {mostRecent && (
//         <MostRecentCard report={mostRecent} forceDownload={forceDownload} />
//       )}

//       <h2 className="section-heading">All Reports</h2>

//       <div className="reports-grid">
//         {visibleReports.map((r) => (
//           <ReportCard key={r.id} report={r} forceDownload={forceDownload} />
//         ))}
//       </div>

//       {filteredReports.length > MIN && (
//         <div className="show-more-container">
//           <button
//             className="btn-primary"
//             onClick={() => setShowMore(!showMore)}
//           >
//             {showMore ? "Show Less" : "Show More Reports"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// /* -----------------------------------------------------
//    SUB COMPONENTS
// ----------------------------------------------------- */

// function CompanyInfoCard({
//   logo,
//   exchange,
//   sector,
//   industry,
//   employee_count,
//   address,
//   description,
//   social_links,
// }) {
//   const [expanded, setExpanded] = useState(false);

//   const shortText =
//     description?.length > 200
//       ? description.slice(0, 200) + "..."
//       : description;

//   return (
//     <div className="company-card">
//       <img
//         src={logo || "/fallback-logo.png"}
//         alt="Company Logo"
//         className="company-logo"
//         onError={(e) => (e.target.src = "/fallback-logo.png")}
//       />

//       <div className="company-details">
//         <p>
//           <strong>Exchange:</strong> {exchange}
//         </p>
//         <p>
//           <strong>Sector:</strong> {sector}
//         </p>
//         <p>
//           <strong>Industry:</strong> {industry}
//         </p>
//         <p>
//           <strong>Employees:</strong> {employee_count}
//         </p>
//         <p>
//           <strong>Address:</strong> {address}
//         </p>

//         <div className="description-section">
//           <strong>Description:</strong>
//           <p>
//             {expanded ? description : shortText}
//             {description?.length > 200 && (
//               <span
//                 className="readmore-toggle"
//                 onClick={() => setExpanded(!expanded)}
//               >
//                 {expanded ? "Read Less" : "Read More"}
//               </span>
//             )}
//           </p>
//         </div>

//         {social_links && (
//           <div className="social-links-section">
//             <strong>Social Links:</strong>
//             <ul>
//               {social_links.website && (
//                 <li>
//                   <a href={social_links.website}>Website</a>
//                 </li>
//               )}
//               {social_links.linkedin && (
//                 <li>
//                   <a href={social_links.linkedin}>LinkedIn</a>
//                 </li>
//               )}
//               {social_links.twitter && (
//                 <li>
//                   <a href={social_links.twitter}>Twitter</a>
//                 </li>
//               )}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function MostRecentCard({ report, forceDownload }) {
//   return (
//     <div className="recent-card">
//       <img
//         src={report.thumbnail_url || "/fallback-thumb.jpg"}
//         alt="Recent Report"
//         className="recent-thumb"
//       />

//       <div>
//         <h2>Most Recent Report</h2>
//         <h3>{report.year} Annual Report</h3>

//         <div className="button-row">
//           <a href={report.report_pdf} target="_blank" rel="noreferrer">
//             <button className="btn-primary">Open PDF</button>
//           </a>

//           <button
//             className="btn-primary"
//             onClick={() =>
//               forceDownload(report.report_pdf, `${report.year}.pdf`)
//             }
//           >
//             Download
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ReportCard({ report, forceDownload }) {
//   return (
//     <div className="report-card">
//       <img
//         src={report.thumbnail_url || "/fallback-thumb.jpg"}
//         alt="Thumbnail"
//         className="report-thumb"
//       />

//       <h3 className="report-year">Year {report.year}</h3>

//       <div className="button-row">
//         <a href={report.report_pdf} target="_blank" rel="noreferrer">
//           <button className="btn-small">Open</button>
//         </a>

//         <button
//           className="btn-small"
//           onClick={() =>
//             forceDownload(report.report_pdf, `${report.year}.pdf`)
//           }
//         >
//           Download
//         </button>
//       </div>
//     </div>
//   );
// }

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

  const BASE_URL = "http://127.0.0.1:8000";

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
        <a href={report.report_pdf} download>
          <button className="btn-small">Download</button>
        </a>
      </div>
    </div>
  );
}

