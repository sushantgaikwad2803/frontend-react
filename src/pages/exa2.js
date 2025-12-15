import React, { useState } from "react";
import axios from "axios";

export default function PDFUpload() {
  const BASE = process.env.REACT_APP_API_URL;
  const uploadUrl = `${BASE}/upload-pdf/`;

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResults([]);

    if (files.length === 0) {
      setMessage("Please select at least one PDF.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("pdf", file));

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Upload completed!");
      setResults(response.data.results || []);

    } catch (error) {
      console.error("Upload error:", error);

      // If backend returns error per file
      if (error.response?.data?.results) {
        setResults(error.response.data.results);
      }

      setMessage("Upload failed due to server error.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Upload Multiple PDF Reports</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />

        <br /><br />

        {files.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Selected Files:</strong>
            <ul>
              {files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            color: "white",
            backgroundColor: loading ? "#0a7cff" : "#007bff",
            transition: "0.3s",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          {loading ? "Uploading..." : "Upload All"}
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>{message}</p>

      {/* Display results clearly */}
      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Upload Summary</h3>

          <ul>
            {results.map((result, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: result.status === "success" ? "green" : "red",
                }}
              >
                {result.file} — {result.status.toUpperCase()}
                {result.status === "error" && (
                  <> (Reason: {result.reason || "Unknown error"})</>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}