import React, { useState, useEffect } from "react";
import "../Style/Udesh.css";

function Udesh() {
  // Initial data (your original objectives)
  const initialUdesh = [
    "संस्था के माध्यम से गोशालाओं का संवर्धन कार्यक्रम शुरू करना।",
    "अलग-अलग सामाजिक संस्था, हाईस्कूल एवं मंडलों को गोशाला का महत्व बताना और अधिक जानकारी देना।",
    "अलग-अलग प्रकार की उपयोगिता तथा गोशालाओं की वजह से होने वाले फायदों को लोगों तक पहुँचाना।",
    "गोशालाओं द्वारा मिलने वाले उत्पादन और संस्था को मिलने वाले उचित लाभ कराकर देना।",
    "गोशाला विशेषज्ञ के मार्गदर्शन में शिविर का आयोजन करना।",
    "गोशालाओं के उपक्रम बढ़ने के लिए अलग-अलग योजनाएँ शुरू करना।",
    "संस्था की जानकारी देने हेतु पुस्तिका प्रकाशित करना।",
    "स्थानिक संस्था, सरकारी एवं गैर-सरकारी अधिकारियों से मार्गदर्शन लेना।",
    "पशु आरोग्य के बारे में मार्गदर्शन करना।",
    "आरोग्य शिविर लगाना।",
    "पहले से ही अस्तित्व में रहने वाली गोशालाओं को हर प्रकार की सहायता देना।"
  ];

  const [udeshList, setUdeshList] = useState(initialUdesh);
  const [newUdesh, setNewUdesh] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  // Load from localStorage when component mounts (so changes persist on refresh in same browser)
  useEffect(() => {
    const savedData = localStorage.getItem("udeshList");
    if (savedData) {
      setUdeshList(JSON.parse(savedData));
    }
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    localStorage.setItem("udeshList", JSON.stringify(udeshList));
  }, [udeshList]);

  // Add new objective
  const handleAdd = () => {
    if (newUdesh.trim() === "") return;
    setUdeshList([...udeshList, newUdesh.trim()]);
    setNewUdesh("");
  };

  // Start editing
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditText(udeshList[index]);
  };

  // Save edited objective
  const handleSaveEdit = () => {
    if (editText.trim() === "") return;
    const updatedList = [...udeshList];
    updatedList[editingIndex] = editText.trim();
    setUdeshList(updatedList);
    setEditingIndex(null);
    setEditText("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  // Delete objective
  const handleDelete = (index) => {
    if (window.confirm("क्या आप इस उद्देश्य को हटाना चाहते हैं?")) {
      const updatedList = udeshList.filter((_, i) => i !== index);
      setUdeshList(updatedList);
    }
  };

  return (
    <div className="udesh-container">
      <div className="udesh-content">
        <h1 className="udesh-title">उद्देश्य</h1>

        {/* Add New Section */}
        <div className="udesh-add-section">
          <h3>नया उद्देश्य जोड़ें</h3>
          <div className="add-form">
            <textarea
              value={newUdesh}
              onChange={(e) => setNewUdesh(e.target.value)}
              placeholder="नया उद्देश्य यहाँ लिखें..."
              rows="3"
            />
            <button onClick={handleAdd} className="add-btn">
              + जोड़ें
            </button>
          </div>
        </div>

        {/* List of Objectives */}
        <div className="udesh-grid">
          {udeshList.map((item, index) => (
            <div key={index} className="udesh-card">
              {editingIndex === index ? (
                // Edit Mode
                <div className="edit-mode">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows="4"
                  />
                  <div className="edit-actions">
                    <button onClick={handleSaveEdit} className="save-btn">सेव करें</button>
                    <button onClick={handleCancelEdit} className="cancel-btn">रद्द करें</button>
                  </div>
                </div>
              ) : (
                // Normal View
                <>
                  <div className="udesh-number">{index + 1}</div>
                  <p className="udesh-text">{item}</p>
                  
                  <div className="card-actions">
                    <button onClick={() => handleEdit(index)} className="edit-btn">
                      ✏️ संपादित करें
                    </button>
                    <button onClick={() => handleDelete(index)} className="delete-btn">
                      🗑️ हटाएं
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="udesh-intro">
          <p>
            हमारी संस्था गोशालाओं के संवर्धन, संरक्षण एवं उनके माध्यम से समाज कल्याण के लिए 
            निम्नलिखित उद्देश्यों के साथ कार्यरत है।
          </p>
        </div>
      </div>
    </div>
  );
}

export default Udesh;