import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Header from "./components/Header";
import HomePage from "./pages/Homepage";
import AllCompanies from "./pages/AllCompanies";
import AllReports from "./pages/AllReports";
import SectorList from "./pages/SectorList";
import OtherFilters from "./pages/OtherFilters";
import UploadPDF from "./pages/exa";
// import UPImage from "./pages/exa1";
// import UPImage1 from "./pages/exa2";
import TermsConditions from "./pages/term";

// If Footer is in pages folder, this import is fine
import Footer from "./pages/Footer";

import "./index.css";

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="app-shell">

          <Header />

          <Routes>

            {/* Home */}
            <Route path="/" element={<HomePage />} />

            {/* Company Pages */}
            <Route path="/company/:companySlug/:exchange" element={<AllReports />} />
            <Route path="/company/:companySlug" element={<AllReports />} />
            <Route path="/company/:companySlug/annual-report/:year" element={<AllReports />} />

            {/* SEO Listing Pages */}
            <Route path="/exchange/:exchange" element={<AllCompanies />} />
            <Route path="/sector/:sector" element={<AllCompanies />} />
            <Route path="/alpha/:alpha" element={<AllCompanies />} />

            {/* Search */}
            <Route path="/search/:query" element={<AllCompanies />} />

            {/* Upload (optional - not for SEO) */}
            <Route path="/upload-pdf" element={<UploadPDF />} />
            <Route path="/OtherFilter" element={<OtherFilters />} />
            <Route path="/sectorslist" element={<SectorList />} />
            <Route path="/terms" element={<TermsConditions />} />

          </Routes>
          <Footer />
          
        </div>
      </Router>
    </HelmetProvider>
  );
}
