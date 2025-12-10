import React, { useState } from "react";
import axios from "axios";

export default function LogoUpload() {
  const BASE = process.env.REACT_APP_API_URL;
  const logoUploadUrl = `${BASE}/upload-logo/`;

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");

  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    industry: "",
    emp_number: "",
    address: "",
    info: "",
    insta_link: "",
    face_link: "",
    youtube_link: "",
    twitter_link: "",
    web_link: "",
    linkedin_link: "",
  });

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setMessage("Please select an image file.");
      return;
    }

    setUploadStatus("uploading");

    const uploadData = new FormData();
    uploadData.append("image", imageFile);

    Object.keys(formData).forEach((key) => {
      uploadData.append(key, formData[key]);
    });

    try {
      const response = await axios.post(logoUploadUrl, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message || "Data saved successfully!");
      setUploadStatus("uploaded");

      setTimeout(() => setUploadStatus("idle"), 2000);

    } catch (error) {
      console.error("Upload error:", error);
      setMessage(error.response?.data?.error || "Upload failed.");
      setUploadStatus("idle");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
      }}
    >
      <h2 style={{ gridColumn: "1 / 3" }}>Upload Company Logo & Info</h2>

      {/* LEFT COLUMN */}
      <div>
        <label>Company Logo (AIM_TCS.png)</label><br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />
        <br /><br />

        <label>Company Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} />

        <label>Sector</label>
        <input type="text" name="sector" value={formData.sector} onChange={handleInputChange} style={inputStyle} />

        <label>Industry</label>
        <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} style={inputStyle} />

        <label>Employee Number</label>
        <input type="text" name="emp_number" value={formData.emp_number} onChange={handleInputChange} style={inputStyle} />

        <label>Address</label>
        <textarea name="address" value={formData.address} onChange={handleInputChange} style={inputStyle} />
      </div>

      {/* RIGHT COLUMN */}
      <div>
        <label>Company Info</label>
        <textarea name="info" value={formData.info} onChange={handleInputChange} style={inputStyle} />

        <label>Instagram</label>
        <input type="url" name="insta_link" value={formData.insta_link} onChange={handleInputChange} style={inputStyle} />

        <label>Facebook</label>
        <input type="url" name="face_link" value={formData.face_link} onChange={handleInputChange} style={inputStyle} />

        <label>YouTube</label>
        <input type="url" name="youtube_link" value={formData.youtube_link} onChange={handleInputChange} style={inputStyle} />

        <label>Twitter</label>
        <input type="url" name="twitter_link" value={formData.twitter_link} onChange={handleInputChange} style={inputStyle} />

        <label>Website</label>
        <input type="url" name="web_link" value={formData.web_link} onChange={handleInputChange} style={inputStyle} />

        <label>LinkedIn</label>
        <input type="url" name="linkedin_link" value={formData.linkedin_link} onChange={handleInputChange} style={inputStyle} />
      </div>

      {/* BUTTON --- FULL WIDTH */}
      <button
        onClick={handleImageSubmit}
        style={{
          gridColumn: "1 / 3",
          padding: "12px 20px",
          border: "none",
          color: "white",
          cursor: "pointer",
          borderRadius: "5px",
          backgroundColor:
            uploadStatus === "uploading"
              ? "#0a7cff"
              : uploadStatus === "uploaded"
              ? "green"
              : "#007bff",
          transition: "0.3s",
          fontSize: "16px",
        }}
        disabled={uploadStatus === "uploading"}
      >
        {uploadStatus === "uploading"
          ? "Uploading..."
          : uploadStatus === "uploaded"
          ? "Uploaded ✔"
          : "Upload & Save"}
      </button>

      <p style={{ gridColumn: "1 / 3", color: "green" }}>{message}</p>
    </div>
  );
}
