/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ImageUpload = ({
  value,
  onChange,
  shape = "square",
  placeholder = "Upload image",
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "flowforge");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const isCircle = shape === "circle";

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          width: isCircle ? "80px" : "100%",
          height: isCircle ? "80px" : "100px",
          borderRadius: isCircle ? "50%" : "8px",
          border: `0.5px dashed ${error ? "var(--priority-urgent-text)" : "var(--border-strong)"}`,
          background: "var(--bg-input)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: uploading ? "not-allowed" : "pointer",
          overflow: "hidden",
          position: "relative",
          transition: "border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!uploading) e.currentTarget.style.borderColor = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = error
            ? "var(--priority-urgent-text)"
            : "var(--border-strong)";
        }}
      >
        {uploading ? (
          <Loader2
            size={20}
            color="var(--accent)"
            style={{ animation: "ff-spin 0.7s linear infinite" }}
          />
        ) : value ? (
          <>
            <img
              src={value}
              alt="Uploaded"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={11} color="#fff" />
            </div>
          </>
        ) : (
          <>
            <Upload size={16} color="var(--text-muted)" />
            {!isCircle && (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  marginTop: "6px",
                  textAlign: "center",
                  padding: "0 8px",
                }}
              >
                {placeholder}
              </p>
            )}
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {error && (
        <p
          style={{
            color: "var(--priority-urgent-text)",
            fontSize: "11px",
            marginTop: "4px",
          }}
        >
          {error}
        </p>
      )}

      <style>{`@keyframes ff-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ImageUpload;
