import React, { useState, useEffect } from "react";
import Header from "../Component/Header";
import Footer from "../Component/footer";
import "../Style/Commite.css";
function Commite() {
  const [teamMembers, setTeamMembers] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("teamMembers");
    if (saved) {
      setTeamMembers(JSON.parse(saved));
    } else {
      // Default data (your original data)
      const defaultData = [
        { id: 1, name: "श्री दिपक शहा", post: "अध्यक्ष", mobile: "९८२२४३२९०३ / ९७६२७१०६७४" },
        { id: 2, name: "श्री कुमुद शास्त्री", post: "सेक्रेटरी", mobile: "७३८७००३७०४" },
        { id: 3, name: "श्री सुरेंद्र पापड़ीवाल", post: "खजिनदार", mobile: "७३५०००२०७९" },
        { id: 4, name: "सौ. जुई प्रवीण शहा", post: "उप सेक्रेटरी", mobile: "९०२९७२५५५६" },
        { id: 5, name: "श्री राजेश शहा", post: "सदस्य", mobile: "९८२२१९६३५५" },
        { id: 6, name: "श्री शांतिनाथ मदन्नवार", post: "सदस्य", mobile: "९९७०२७९८८८" },
        { id: 7, name: "श्री आशिष दिपक शहा", post: "सदस्य", mobile: "९८९०२००५५२" },
      ];
      setTeamMembers(defaultData);
      localStorage.setItem("teamMembers", JSON.stringify(defaultData));
    }
  }, []);

  return (
    <>
      <Header />
      <div className="team-page">
        <h1 className="team-title">हमारी टीम</h1>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <h3 className="member-name">{member.name}</h3>
              <p className="member-post">{member.post}</p>
              <p className="member-mobile">
                📞 {member.mobile}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Commite;