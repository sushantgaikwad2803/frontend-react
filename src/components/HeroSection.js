import React, { useEffect, useRef } from 'react';
import './Herosection.css';

// Your image imports
import worldMapBackground from '../media/s.avif';
import reportCard1 from '../media/report1.png';
import reportCard2 from '../media/report4.avif';
import reportCard3 from '../media/report3.webp';
import reportCard4 from '../media/report2.webp'; 
import reportCard5 from '../media/report5.jpg'; 
import reportCard6 from '../media/report6.webp';

const HeroSection = () => {
  const cardsRef = useRef([]);  

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
      }
    );

    // Observe all cards
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  // Function to add ref to each card
  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <div className="hero-container">
      {/* Background Image - World Map */}
      <div className="hero-background-image"></div>
      
      {/* Content Overlay */}
      <div className="hero-content">
        <div className="hero-cards-section">
          <img 
            ref={addToRefs}
            src={reportCard1} 
            alt="Annual Report" 
            className="hero-card card-1" 
          />
          <img 
            ref={addToRefs}
            src={reportCard2} 
            alt="Financial Report" 
            className="hero-card card-2" 
          />
          <img 
            ref={addToRefs}
            src={reportCard3} 
            alt="Company Overview" 
            className="hero-card card-3" 
          />
          <img 
            ref={addToRefs}
            src={reportCard4} 
            alt="Investment Decisions" 
            className="hero-card card-4" 
          />
          <img 
            ref={addToRefs}
            src={reportCard5} 
            alt="Market Analysis" 
            className="hero-card card-5" 
          />
          <img 
            ref={addToRefs}
            src={reportCard6} 
            alt="Strategic Insights" 
            className="hero-card card-6" 
          />
        </div>

        <div className="hero-text-content">
          <h1>Explore 152,075 annual reports from 10,379 leading global companies to fuel your strategic investment decisions.</h1>
          <p>Access comprehensive financial data, market insights, and strategic analysis from the world's top enterprises to make informed investment choices.</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;