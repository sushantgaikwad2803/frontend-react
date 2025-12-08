import React, { useState } from "react";
import axios from "axios";

export default function PDFUpload({ uploadUrl = "http://127.0.0.1:8000/upload-pdf/" }) {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        <button type="submit">Upload</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
