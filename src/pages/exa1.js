import React, { useState } from "react";
import axios from "axios";

export default function LogoUpload({ logoUploadUrl = "http://127.0.0.1:8000/upload-logo/" }) {
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setMessage("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(logoUploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message || "Logo updated successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Image Upload error:", error);
      setMessage(error.response?.data?.error || "Upload failed.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Logo Image</h2>
      <form onSubmit={handleImageSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />
        <br /><br />
        <button type="submit">Upload Image</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
