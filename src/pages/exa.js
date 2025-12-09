import React, { useState } from "react";
import axios from "axios";

export default function PDFUpload() {

  const BASE = process.env.REACT_APP_API_URL;
  const uploadUrl = `${BASE}/upload-pdf/`;

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [clicked, setClicked] = useState(false);  // 👈 Track button click

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Change color on click
    setClicked(true);

    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("File uploaded successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed.");
    } finally {
      // After 1 second, reset the button color
      setTimeout(() => setClicked(false), 1000);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload PDF</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <br /><br />

        {/* Inline CSS Button */}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            color: "white",
            backgroundColor: clicked ? "#0a7cff" : "#007bff",  // 👈 color changed
            transition: "0.3s",
            borderRadius: "5px"
          }}
        >
          {clicked ? "Uploading..." : "Upload"}
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}


