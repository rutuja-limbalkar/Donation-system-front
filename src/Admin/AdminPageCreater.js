import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const styles = `
  .admin-page-wrapper { background-color: #f4f7f6; padding: 40px 0; min-height: 100vh; }
  .admin-card { border: none; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
  .admin-header { font-weight: 700; color: #2c3e50; margin-bottom: 25px; position: relative; padding-bottom: 10px; border-bottom: 3px solid #fd7e14; display: inline-block; }
  .page-item-card { background: white; border-radius: 10px; padding: 15px 25px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border-left: 6px solid #fd7e14; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .custom-input { border: 1px solid #e0e0e0; padding: 10px; border-radius: 8px; }
  .custom-input:focus { border-color: #fd7e14; box-shadow: 0 0 0 0.2rem rgba(253, 126, 20, 0.1); }
  .btn-action { font-weight: 600; padding: 10px 30px; border-radius: 8px; border: none; }
`;

const AdminPageCreator = () => {
    const [pages, setPages] = useState([]);
    const [formData, setFormData] = useState({ id: null, title: '', slug: '', content: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => { fetchPages(); }, []);

    const fetchPages = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/pages/active');
            setPages(res.data);
        } catch (err) { console.error(err); }
    };

    // This function fills the form when "Edit" is clicked
    const startEdit = (page) => {
        setFormData(page); // Put existing data into the top form fields
        setIsEditing(true); // Change mode to editing
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up so admin sees the form
    };

    const handleCancelEdit = () => {
        setFormData({ id: null, title: '', slug: '', content: '' });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // UPDATE logic
                await axios.put(`http://localhost:8080/api/pages/${formData.id}`, formData);
                setStatus({ type: 'success', msg: 'Page updated successfully!' });
            } else {
                // CREATE logic
                await axios.post('http://localhost:8080/api/pages', formData);
                setStatus({ type: 'success', msg: 'New page published!' });
            }
            handleCancelEdit(); // Reset form
            fetchPages(); // Refresh list
        } catch (err) {
            setStatus({ type: 'danger', msg: 'Operation failed.' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this page?")) {
            await axios.delete(`http://localhost:8080/api/pages/${id}`);
            fetchPages();
        }
    };

    return (
        <div className="admin-page-wrapper">
            <style>{styles}</style>
            <Container>
                {/* SINGLE FORM FOR BOTH CREATE AND EDIT */}
                <div className="admin-card p-4 mb-5 shadow-sm">
                    <h3 className="admin-header">{isEditing ? "Update Page Details" : "Add New Dynamic Page"}</h3>
                    {status.msg && <Alert variant={status.type} dismissible onClose={() => setStatus({msg:''})}>{status.msg}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label className="fw-bold">Title</Form.Label>
                                <Form.Control 
                                    className="custom-input"
                                    value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})} 
                                    required 
                                />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label className="fw-bold">Slug</Form.Label>
                                <Form.Control 
                                    className="custom-input"
                                    value={formData.slug} 
                                    onChange={e => setFormData({...formData, slug: e.target.value})} 
                                    required 
                                />
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Content (HTML)</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={6} 
                                className="custom-input"
                                value={formData.content} 
                                onChange={e => setFormData({...formData, content: e.target.value})} 
                                required 
                            />
                        </Form.Group>
                        
                        <Button className="btn-action me-2" variant={isEditing ? "warning" : "success"} type="submit">
                            {isEditing ? "Update Changes" : "Publish Page"}
                        </Button>

                        {isEditing && (
                            <Button variant="light" className="btn-action" onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                        )}
                    </Form>
                </div>

                {/* ACTIVE PAGES LIST */}
                <h3 className="admin-header">Existing Site Pages</h3>
                {pages.map(p => (
                    <div className="page-item-card" key={p.id}>
                        <div className="page-info">
                            <h5>{p.title}</h5>
                            <span>Path: /pages/{p.slug}</span>
                        </div>
                        <div>
                            <Button variant="light" className="text-primary me-2 fw-bold" onClick={() => startEdit(p)}>
                                Edit Details
                            </Button>
                            <Button variant="light" className="text-danger fw-bold" onClick={() => handleDelete(p.id)}>
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </Container>
        </div>
    );
};

export default AdminPageCreator;