import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RandomLogo.css";

export default function RandomLogo() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Base API URL
  const BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function fetchLogos() {
      try {
        const res = await axios.get(`${BASE}/random-logos/`);
        // Ensure data is an array
        setData(res.data.companies || []);
      } catch (err) {
        console.error("Error fetching logos:", err);
      }
    }

    fetchLogos();
  }, [BASE]);

  // Navigate to company reports page with both ticker & exchange

  return (
    <div className="logo-section1">
      <h2 className="logo-title1">Spotlighted Firms</h2>

      <div className="logo-wrapper1">
        <div className="logo-grid1">
          {data.map((company) => (
            <div
              key={company.id}
              className="logo-card1"
              onClick={() => {
                const slug = `${company.name}-${company.ticker}`
                  .toLowerCase()
                  .replace(/\s+/g, "-");

                navigate(`/company/${slug}/${company.exchange}`);
              }}
            >
              <img
                src={company.logo || "/fallback-logo.png"}
                alt={company.name}
                className="company-logo1"
                onError={(e) => (e.target.src = "/fallback-logo.png")}
              />
              <p>{company.ticker}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
