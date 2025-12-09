import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RandomLogo.css";

export default function RandomLogo() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Laptop IP address → required for mobile access
  const BASE = "https://backend-django-phwi.onrender.com";

  useEffect(() => {
    axios
      .get(`${BASE}/random-logos/`)   // ✅ FIXED HERE
      .then((res) => setData(res.data.companies))
      .catch((err) => console.error(err));
  }, []);

  const goToReports = (ticker) => {
    navigate(`/company-reports/${ticker}`);
  };

  return (
    <div className="logo-section1">
      <h2 className="logo-title1">Spotlighted Firms</h2>

      <div className="logo-wrapper1">
        <div className="logo-grid1">
          {data.map((item) => (
            <div
              key={item.id}
              className="logo-card1"
              onClick={() => goToReports(item.ticker)}
            >
              <img src={item.logo} alt={item.name} className="company-logo1" />
              <p>{item.ticker}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
