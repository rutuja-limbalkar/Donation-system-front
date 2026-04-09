import React, { useState, useEffect } from "react";

function Udesh() {
  // Default objectives (you can change these anytime)
  const defaultUdesh = [
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

  const [udeshList, setUdeshList] = useState(defaultUdesh);

  // Load saved data from localStorage (so if admin updated it, user can see latest)
  useEffect(() => {
    const savedData = localStorage.getItem("udeshList");
    if (savedData) {
      setUdeshList(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="udesh-container">
      <div className="udesh-content">
        <h1 className="udesh-title">उद्देश्य</h1>

        <div className="udesh-grid">
          {udeshList.map((item, index) => (
            <div key={index} className="udesh-card">
              <div className="udesh-number">{index + 1}</div>
              <p className="udesh-text">{item}</p>
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