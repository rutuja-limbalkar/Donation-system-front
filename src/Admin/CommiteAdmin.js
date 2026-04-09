import React, { useState, useEffect } from "react";

function CommiteAdmin() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPost, setNewPost] = useState("");
  const [newMobile, setNewMobile] = useState("");

  // Editing states
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPost, setEditPost] = useState("");
  const [editMobile, setEditMobile] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("teamMembers");
    if (saved) {
      setTeamMembers(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (newData) => {
    setTeamMembers(newData);
    localStorage.setItem("teamMembers", JSON.stringify(newData));
  };

  // Add new member
  const addMember = () => {
    if (!newName || !newPost) {
      alert("नाम और पद अनिवार्य हैं!");
      return;
    }

    const newMember = {
      id: Date.now(),
      name: newName.trim(),
      post: newPost.trim(),
      mobile: newMobile.trim(),
    };

    const updated = [newMember, ...teamMembers];
    saveToStorage(updated);

    setNewName("");
    setNewPost("");
    setNewMobile("");
    alert("✅ नया सदस्य जोड़ा गया!");
  };

  // Start Editing
  const startEditing = (member) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditPost(member.post);
    setEditMobile(member.mobile);
  };

  // Save Edit
  const saveEdit = () => {
    const updated = teamMembers.map(member =>
      member.id === editingId
        ? { ...member, name: editName.trim(), post: editPost.trim(), mobile: editMobile.trim() }
        : member
    );
    saveToStorage(updated);
    setEditingId(null);
    alert("✅ जानकारी अपडेट हो गई!");
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Delete Member
  const deleteMember = (id) => {
    if (!window.confirm("क्या आप इस सदस्य को हटाना चाहते हैं?")) return;
    const updated = teamMembers.filter(member => member.id !== id);
    saveToStorage(updated);
  };

  return (
    <div className="admin-container">
      <h1>Team Admin Panel</h1>

      {/* Add New Member */}
      <div className="admin-card">
        <h2>नया सदस्य जोड़ें</h2>
        <input
          type="text"
          placeholder="नाम"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="text"
          placeholder="पद (अध्यक्ष, सेक्रेटरी आदि)"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <input
          type="text"
          placeholder="मोबाइल नंबर"
          value={newMobile}
          onChange={(e) => setNewMobile(e.target.value)}
        />
        <button onClick={addMember} className="add-btn">+ जोड़ें</button>
      </div>

      {/* All Members */}
      <div className="admin-card">
        <h2>सभी सदस्य ({teamMembers.length})</h2>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card admin-mode">
              {editingId === member.id ? (
                // Edit Mode
                <div>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="नाम"
                  />
                  <input
                    value={editPost}
                    onChange={(e) => setEditPost(e.target.value)}
                    placeholder="पद"
                  />
                  <input
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    placeholder="मोबाइल"
                  />
                  <div className="edit-actions">
                    <button onClick={saveEdit} className="save-btn">Save</button>
                    <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                // Normal View
                <div>
                  <h3>{member.name}</h3>
                  <p><strong>{member.post}</strong></p>
                  <p>📞 {member.mobile}</p>

                  <div className="action-buttons">
                    <button onClick={() => startEditing(member)} className="edit-btn">
                      ✏️ Edit
                    </button>
                    <button onClick={() => deleteMember(member.id)} className="delete-btn">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommiteAdmin;