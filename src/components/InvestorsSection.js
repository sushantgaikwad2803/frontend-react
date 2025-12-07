import React from "react";
import "./InvestorsSection.css";
import M1 from '../media/blackroack.jpg';
import M2 from '../media/fidelity.jpg';
import M3 from '../media/j.p.png';
import M4 from '../media/Vanguard.png';
import M5 from '../media/Allianz.png';

export default function InvestorsSection() {
  const logos = [
    M1 ,
    M2 ,
    M3 ,
    M4 ,
    M5 
  ]; 

  return (
    <div className="investor-wrapper">
      <h2 className="investor-title">Used by Top Institutional Investors Around the Global</h2>
      <p className="investor-subtitle">
        Investors from around the world turn to AnnualReports.com for timely insights into global business activity.
      </p>

      <div className="investor-logos">
        {logos.map((logo, index) => (
          <img key={index} src={logo} alt="Investor Logo" className="investor-logo" />
        ))}
      </div>
    </div>
  );
}
