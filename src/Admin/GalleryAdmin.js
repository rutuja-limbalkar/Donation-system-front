import React, { useState } from "react";

const API = "http://localhost:8080/gallery";
const CLOUD_NAME = "ddchyegwp";
const UPLOAD_PRESET = "my_preset";

function GalleryAdmin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState([null]);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!title) return alert("Title required");

    setLoading(true);

    try {
      const uploadedImages = await Promise.all(
        images
          .filter((f) => f)
          .map(async (file) => ({
            path: await uploadImage(file),
          }))
      );

      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date,
          images: uploadedImages,
        }),
      });

      alert("Uploaded Successfully");

      setTitle("");
      setDescription("");
      setDate("");
      setImages([null]);

    } catch (err) {
      console.log(err);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Upload Gallery
        </h2>

        {/* TITLE */}
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />

        {/* IMAGE INPUTS */}
        {images.map((_, i) => (
          <input
            key={i}
            type="file"
            onChange={(e) => {
              const copy = [...images];
              copy[i] = e.target.files[0];
              setImages(copy);
            }}
            style={styles.input}
          />
        ))}

        {/* ADD MORE */}
        <button
          onClick={() => setImages([...images, null])}
          style={styles.addBtn}
        >
          + Add Image
        </button>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={styles.submit}
        >
          {loading ? "Uploading..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  addBtn: {
    background: "transparent",
    border: "none",
    color: "#2563eb",
    marginBottom: "10px",
    cursor: "pointer",
  },

  submit: {
    width: "100%",
    padding: "10px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default GalleryAdmin;