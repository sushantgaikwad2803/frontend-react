import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import './Homepage.css';
// import HomepImage from '../media/Homep.png';
import slid1 from '../media/AIM.png';
import slid2 from '../media/AMEX.png';
import slid3 from '../media/asx.jpg';
import slid4 from '../media/lse.jpg';
import slid5 from '../media/NASDAQ.png';
import slid6 from '../media/NYSE.png';
import slid7 from '../media/OTC.png';
import slid8 from '../media/TSX-V.png';
import slid9 from '../media/tsx.jpg';
import HeroSection from '../components/HeroSection';
import Company from '../components/RandomReport';
import RandomLogo from '../components/RandomLogo';
import InvestorsSection from '../components/InvestorsSection';
import Filter from '../components/Filter';



const Homepage = () => {
  const trackRef = useRef(null);
  const navigate = useNavigate();

  const images = [
    { id: 1, src: slid1, alt: "AIM" },
    { id: 2, src: slid2, alt: "AMEX" },
    { id: 3, src: slid3, alt: "ASX" },
    { id: 4, src: slid4, alt: "LSE" },
    { id: 5, src: slid5, alt: "NASDAQ" },
    { id: 6, src: slid6, alt: "NYSE" },
    { id: 7, src: slid7, alt: "OTC" },
    { id: 8, src: slid8, alt: "TSX-V" },
    { id: 9, src: slid9, alt: "TSX" },
  ];

  /** 🔥 Updated: Navigate with exchange param */
  const handleImageClick = (exchangeName) => {
    navigate(`/AllCompanies/${exchangeName}`);
  };

  const allImages = [...images, ...images, ...images, ...images, ...images];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrame;
    let position = 0;
    const speed = 0.5;

    const animate = () => {
      position -= speed;
      if (position <= -track.scrollWidth / 2) position = 0;

      track.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title> Annual Reports PDF Download | AR Annual Report</title>

        <meta
          name="description"
          content="Download latest annual reports of global companies like Apple, Microsoft, Tesla, Amazon in PDF format. Access financial reports, investor data, and company insights."
        />

        <meta
          name="keywords"
          content="
          annual reports,
      annual report pdf,
      global annual reports,
      company financial reports,
      apple annual report 2024,
      microsoft annual report,
      tesla annual report pdf,
      amazon annual report download,
      investor reports pdf,
      corporate financial statements,
      stock exchange reports
    "
        />

        <link rel="canonical" href="https://arannualreport.com/" />

        {/* Google Verification */}
        <meta
          name="google-site-verification"
          content="bc6r5V5HAg-ia7AMz9s8GsbHVF8jnGN4Ez1S1"
        />

        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AR Annual Report",
            "url": "https://arannualreport.com"
          })}
        </script>
      </Helmet>

      <div className="homepage">
        <HeroSection />

        {/* Continuous Flow Section */}
        <section className="continuous-flow-section">
          <div className="flow-container">

            <div className="flow-track">
              <div ref={trackRef} className="image-flow">
                {allImages.map((image, index) => (
                  <div
                    key={`${image.id}-${index}`}
                    className="flow-image"
                    onClick={() => handleImageClick(image.alt)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      onError={() => console.log('Image failed:', image.alt)}
                    />
                    <div className="flow-overlay">
                      <span className="flow-title">{image.alt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Company />
        <RandomLogo />
        <InvestorsSection />
        <Filter />
      </div>
    </>
  );
};

export default Homepage;
