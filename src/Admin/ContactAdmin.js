import React, { useState, useEffect } from 'react';
import "../Style/contact.css";

function ContactAdmin() {
  const [content, setContent] = useState({
    title: "Contact Us",
    subTitle: "हमसे संपर्क करें",
    description: `
      <p>आप हमारी संस्था से जुड़ने, गोशाला संबंधी सहायता लेने या कोई सुझाव देने के लिए नीचे दिए गए फॉर्म के माध्यम से संपर्क कर सकते हैं।</p>
      <p>हम आपके संदेश का शीघ्र उत्तर देंगे।</p>
    `
  });

  const [messages, setMessages] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem("contactContent");
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }

    const savedMessages = localStorage.getItem("contactMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save content to localStorage
  const saveContent = (newContent) => {
    setContent(newContent);
    localStorage.setItem("contactContent", JSON.stringify(newContent));
    alert("✅ Page content updated successfully!");
  };

  // Handle input change
  const handleContentChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  // Fake Submit (for demo - stores in localStorage)
  const handleFakeSubmit = (formData) => {
    const newMessage = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleString()
    };
    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);
    localStorage.setItem("contactMessages", JSON.stringify(updatedMessages));
  };

  // Delete message
  const deleteMessage = (id) => {
    if (!window.confirm("क्या आप इस संदेश को हटाना चाहते हैं?")) return;
    
    const updated = messages.filter(msg => msg.id !== id);
    setMessages(updated);
    localStorage.setItem("contactMessages", JSON.stringify(updated));
    alert("संदेश हटा दिया गया");
  };

  return (
    <div className="admin-container">
      <h1>Admin - Contact Page Management</h1>

      {/* Edit Page Content */}
      <div className="admin-card">
        <h2>Edit Page Content</h2>
        <form onSubmit={(e) => { e.preventDefault(); saveContent(content); }}>
          <label>Title:</label>
          <input 
            type="text" 
            name="title"
            value={content.title} 
            onChange={handleContentChange}
          />

          <label>Subtitle:</label>
          <input 
            type="text" 
            name="subTitle"
            value={content.subTitle} 
            onChange={handleContentChange}
          />

          <label>Description (HTML supported):</label>
          <textarea 
            name="description"
            rows="6"
            value={content.description} 
            onChange={handleContentChange}
          />

          <button type="submit" className="update-btn">Update Page Content</button>
        </form>
      </div>

      {/* Messages Section */}
      <div className="admin-card">
        <h2>Contact Messages ({messages.length})</h2>
        
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <table className="message-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.subject}</td>
                  <td>{msg.message}</td>
                  <td>{msg.date}</td>
                  <td>
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ContactAdmin;