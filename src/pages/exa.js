import React, { useState } from "react";
import axios from "axios";

export default function PDFUpload() {
  const BASE = process.env.REACT_APP_API_URL;
  const uploadUrl = `${BASE}/upload-pdf/`;

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [clicked, setClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClicked(true);

    if (files.length === 0) {
      setMessage("Please select at least one PDF file.");
      setClicked(false);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("pdf", file)); // MULTIPLE FILES ✔

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Upload completed successfully!");
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed.");
    } finally {
      setTimeout(() => setClicked(false), 1000);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Multiple PDFs</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          multiple            // 👈 ALLOWS MULTIPLE PDFs ✔
          onChange={(e) => setFiles([...e.target.files])}
          required
        />
        <br /><br />

        {/* Show selected file names */}
        {files.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Selected Files:</strong>
            <ul>
              {files.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            color: "white",
            backgroundColor: clicked ? "#0a7cff" : "#007bff", 
            transition: "0.3s",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          {clicked ? "Uploading..." : "Upload All"}
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}
