import React, { useState } from "react";

function Imggallery({ galleryData = [] }) {

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <section style={{ padding: "40px 0" }}>
        <div className="container">

          <h5 style={{ color: "#F59933", textAlign: "center", marginBottom: "30px", fontWeight: "bold" }}>
            Image Gallery
          </h5>

          <div className="row">
            {galleryData.map((item) => (
              <div key={item.id} className="col-md-4 col-sm-6 mb-4">
                <div style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  backgroundColor: "#fff"
                }}>

                  {/* Image */}
                  <img
                    src={item.images?.[0]?.path}
                    alt={item.title}
                    onClick={() => setSelectedImage(item.images?.[0]?.path)}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      display: "block",
                      cursor: "pointer"
                    }}
                  />

                  {/* Title + Description */}
                  <div style={{ padding: "10px 14px 12px" }}>
                    <p style={{
                      margin: 0,
                      fontSize: "15px",
                      color: "#444",
                      fontWeight: "500"
                    }}>
                      {item.title || "Untitled"}
                    </p>

                    <p style={{
                      margin: "5px 0 0",
                      fontSize: "13px",
                      color: "#777"
                    }}>
                      {item.description}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 🔥 MODAL (FULL IMAGE VIEW) */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <img
            src={selectedImage}
            alt="Full View"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px"
            }}
          />
        </div>
      )}

    </div>
  );
}

export default Imggallery;