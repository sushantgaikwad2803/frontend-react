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
      setMessage("All fields are required.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("url", url);
    formData.append("exchange", exchange);
    formData.append("ticker", ticker);

    try {
      const response = await axios.post(autoUploadUrl, formData);

      setMessage("Auto PDF upload completed!");
      setResults(response.data.results || []);
    } catch (error) {
      console.error("Auto upload error:", error);
      setMessage("Auto upload failed due to server error.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Auto Upload PDF Reports from URL</h2>

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
            cursor: "pointer",
            color: "white",
            backgroundColor: "#007bff",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          {loading ? "Processing..." : "Auto Upload"}
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>{message}</p>

      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Upload Summary</h3>
          <ul>
            {results.map((res, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: res.status === "success" ? "green" : "red",
                }}
              >
                {res.year || res.pdf} — {res.status.toUpperCase()}
                {res.status === "error" && (
                  <> (Reason: {res.reason})</>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
