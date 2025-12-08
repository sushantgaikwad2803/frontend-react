import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Header from "./components/Header";
import HomePage from "./pages/Homepage";
import AllCompanies from "./pages/AllCompanies";
import AllReports from "./pages/AllReports";
import SectorList from "./pages/SectorList";
import OtherFilters from "./pages/OtherFilters";
import UploadPDF from "./pages/exa";
import UPImage from "./pages/exa1";

// If Footer is in pages folder, this import is fine
import Footer from "./pages/Footer";

import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="app-shell">

        <Header />

        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* All Companies Pages */}
          <Route path="/AllCompanies" element={<AllCompanies />} />
          <Route path="/AllCompanies/:exchange" element={<AllCompanies />} />

          {/* Company Reports */}
          <Route path="/company-reports/:ticker" element={<AllReports />} />

          {/* Sector Navigation */}
          <Route path="/sectorslist" element={<SectorList />} />
          <Route path="/companies/sector/:sector" element={<AllCompanies />} />

          {/* Filters */}
          <Route path="/companies/alpha/:alpha" element={<AllCompanies />} />
          <Route path="/OtherFilter" element={<OtherFilters />} />

          <Route path="/upload-pdf" element={<UploadPDF />} />

           <Route path="/upload-logo" element={<UPImage />} />
          
        </Routes>

        {/* Footer inside Router but outside Routes */}
        <Footer />
      </div>
    </Router>
  );
}
