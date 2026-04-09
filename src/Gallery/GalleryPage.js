import React, { useEffect, useState } from "react";
import Imggallery from "../Gallery/Imggallery";

const API = "http://localhost:8080/gallery";

function GalleryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
  .then(res => {
    if (!res.ok) {
      throw new Error("API not allowed (403)");
    }
    return res.json();
  })
  .then(res => setData(res))
  .catch(err => console.log(err))
  .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", padding: "30px" }}>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🖼️ Gallery Page
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <Imggallery galleryData={data} />
      )}

    </div>
  );
}

export default GalleryPage;