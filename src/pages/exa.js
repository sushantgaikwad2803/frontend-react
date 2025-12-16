import React, { useState } from "react";
import axios from "axios";

export default function AutoPDFUpload() {
  const BASE = process.env.REACT_APP_API_URL;
  const autoUploadUrl = `${BASE}/auto-upload-pdf/`;

  const [url, setUrl] = useState("");
  const [exchange, setExchange] = useState("");
  const [ticker, setTicker] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResults([]);

    if (!url || !exchange || !ticker) {
      setMessage("❌ All fields are required.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("url", url);
    formData.append("exchange", exchange);
    formData.append("ticker", ticker);

    try {
      const response = await axios.post(autoUploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000, // ⏱ 2 min (PDF uploads)
      });

      setMessage("✅ Auto PDF upload completed.");
      setResults(response.data.results || []);
    } catch (error) {
      console.error("Auto upload error:", error);

      // 🔥 SHOW REAL BACKEND ERROR
      const backendMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Server error occurred.";

      setMessage(`❌ Auto upload failed: ${backendMessage}`);

      // 🔥 SHOW PARTIAL RESULTS IF ANY
      if (error.response?.data?.results) {
        setResults(error.response.data.results);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "650px" }}>
      <h2>Auto Upload PDF Reports</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Reports Page URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="Exchange (e.g. ASX)"
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="Ticker (e.g. AEI)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            color: "white",
            backgroundColor: loading ? "#999" : "#007bff",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          {loading ? "Processing PDFs..." : "Auto Upload"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "12px", fontWeight: "bold" }}>{message}</p>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Upload Summary</h3>
          <ul style={{ paddingLeft: "20px" }}>
            {results.map((res, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "8px",
                  color: res.status === "success" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {res.year || res.pdf} — {res.status.toUpperCase()}
                {res.status === "error" && res.reason && (
                  <div style={{ fontWeight: "normal", fontSize: "14px" }}>
                    Reason: {res.reason}
                  </div>
                )}
                {res.status === "success" && res.pdf_url && (
                  <div style={{ fontWeight: "normal", fontSize: "14px" }}>
                    <a
                      href={res.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PDF
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
