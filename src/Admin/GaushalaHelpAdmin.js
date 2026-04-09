import React, { useEffect, useState } from "react";
// import "../admin/AdminDashboard"
const API = "http://localhost:8080/api/gaushala";

const initialForm = {
  gaushalaName: "",
  contactPerson: "",
  contactPhone: "",
  helpType: ""
};

function GaushalaHelpAdmin() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error loading data:", err);
      showMessage("error", "Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "gaushalaName" || name === "contactPerson") {
      // Allow only letters and spaces
      const regex = /^[A-Za-z\s]*$/;
      if (value === "" || regex.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } 
    else if (name === "contactPhone") {
      // Allow only numbers, max 10 digits
      const regex = /^[0-9]{0,10}$/;
      if (regex.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } 
    else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateForm = () => {
    if (!form.gaushalaName.trim()) {
      showMessage("error", "Gaushala Name is required");
      return false;
    }
    if (!form.contactPerson.trim()) {
      showMessage("error", "Contact Person is required");
      return false;
    }
    if (!form.contactPhone || form.contactPhone.length !== 10) {
      showMessage("error", "Phone number must be exactly 10 digits");
      return false;
    }
    if (!form.helpType) {
      showMessage("error", "Please select Help Type");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let res;
      if (editId) {
        res = await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      }

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      showMessage("success", editId ? "Updated successfully!" : "Added successfully!");
      setForm(initialForm);
      setEditId(null);
      loadData();
    } catch (err) {
      console.error("Error:", err);
      showMessage("error", "Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gaushala?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      showMessage("success", "Record deleted successfully");
      loadData();
    } catch (err) {
      showMessage("error", "Failed to delete record.");
    }
  };

  const handleEdit = (item) => {
    setForm({
      gaushalaName: item.gaushalaName || "",
      contactPerson: item.contactPerson || "",
      contactPhone: item.contactPhone || "",
      helpType: item.helpType || ""
    });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const filteredData = data
    .filter((item) => {
      const matchesSearch =
        (item.gaushalaName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.contactPerson || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.contactPhone || "").includes(searchTerm);

      const matchesFilter = !filterType || item.helpType === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => (b.id || 0) - (a.id || 0));

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Gaushala Management</h2>

      {message.text && (
        <div style={{
          ...styles.message,
          backgroundColor: message.type === "success" ? "#d1fae5" : "#fee2e2",
          color: message.type === "success" ? "#166534" : "#991b1b"
        }}>
          {message.text}
        </div>
      )}

      {/* FORM */}
      <div style={styles.form}>
        <input
          name="gaushalaName"
          placeholder="Gaushala Name *"
          value={form.gaushalaName}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="contactPerson"
          placeholder="Contact Person *"
          value={form.contactPerson}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="contactPhone"
          placeholder="Phone Number (10 digits) *"
          value={form.contactPhone}
          onChange={handleChange}
          maxLength={10}
          style={styles.input}
        />
        <select
          name="helpType"
          value={form.helpType}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Help Type *</option>
          <option value="चारा">चारा (Fodder)</option>
          <option value="शेड">शेड (Shelter)</option>
          <option value="मेडिकल">मेडिकल (Medical)</option>
        </select>

        <div style={styles.formButtons}>
          <button onClick={handleSubmit} style={styles.btn} disabled={loading}>
            {loading ? "Processing..." : editId ? "Update Gaushala" : "Add Gaushala"}
          </button>
          {editId && (
            <button onClick={resetForm} style={styles.cancelBtn}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">All Types</option>
          <option value="चारा">चारा</option>
          <option value="शेड">शेड</option>
          <option value="मेडिकल">मेडिकल</option>
        </select>
      </div>

      {/* Records */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h3>Gaushala Records ({filteredData.length})</h3>
          <button onClick={loadData} style={styles.refreshBtn} disabled={loading}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
        ) : filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id} style={styles.row}>
              <div style={styles.cell}><strong>{item.gaushalaName}</strong></div>
              <div style={styles.cell}>{item.contactPerson}</div>
              <div style={styles.cell}>{item.contactPhone}</div>
              <div style={styles.cell}>
                <span style={{
                  ...styles.helpBadge,
                  backgroundColor: item.helpType === "चारा" ? "#eab308" :
                                  item.helpType === "शेड" ? "#3b82f6" : "#ef4444"
                }}>
                  {item.helpType || "—"}
                </span>
              </div>
              <div style={styles.actionCell}>
                <button onClick={() => handleEdit(item)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noData}>No records found.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "30px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial, sans-serif", background: "#f8fafc" },
  heading: { fontSize: "32px", marginBottom: "25px", color: "#1e3a8a", textAlign: "center" },
  message: { padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", fontWeight: "500" },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
    marginBottom: "30px",
    padding: "25px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
  },
  input: { padding: "12px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "15px" },
  formButtons: { gridColumn: "1 / -1", display: "flex", gap: "12px", marginTop: "10px" },
  btn: { flex: 1, padding: "14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "600" },
  cancelBtn: { flex: 1, padding: "14px", background: "#64748b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" },
  filterContainer: { display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" },
  searchInput: { flex: 1, padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "15px" },
  filterSelect: { padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "15px" },
  tableContainer: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" },
  row: { display: "grid", gridTemplateColumns: "2fr 1.5fr 1.3fr 1fr 110px", padding: "16px 12px", borderBottom: "1px solid #f1f5f9", alignItems: "center" },
  cell: { padding: "8px", color: "#1e2937" },
  helpBadge: { padding: "5px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", color: "white" },
  actionCell: { display: "flex", gap: "8px" },
  editBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  deleteBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  refreshBtn: { padding: "8px 16px", background: "#64748b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  noData: { textAlign: "center", padding: "60px", color: "#64748b" }
};

export default GaushalaHelpAdmin;