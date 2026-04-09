import React, { useState, useEffect } from 'react';
import Header from '../Component/Header';
import Footer from '../Component/footer';
import "../Style/contact.css";

function Contact() {
  const defaultContent = {
    title: "Contact Us",
    subTitle: "हमसे संपर्क करें",
    description: `
      <p>आप हमारी संस्था से जुड़ने, गोशाला संबंधी सहायता लेने या कोई सुझाव देने के लिए नीचे दिए गए फॉर्म के माध्यम से संपर्क कर सकते हैं।</p>
      <p>हम आपके संदेश का शीघ्र उत्तर देंगे।</p>
    `
  };

  const [content, setContent] = useState(defaultContent);
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load page content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem("contactContent");
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    let errors = {};
    if (!form.name.trim()) errors.name = "नाम आवश्यक है";
    if (!form.email.trim()) errors.email = "ईमेल आवश्यक है";
    if (!form.subject.trim()) errors.subject = "विषय आवश्यक है";
    if (!form.message.trim()) errors.message = "संदेश आवश्यक है";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSuccess("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // === SAVE MESSAGE TO LOCALSTORAGE ===
    const newMessage = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      date: new Date().toLocaleString('hi-IN')
    };

    // Get existing messages or empty array
    const existingMessages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
    const updatedMessages = [newMessage, ...existingMessages];

    localStorage.setItem("contactMessages", JSON.stringify(updatedMessages));

    // Show success and reset form
    setTimeout(() => {
      setFormSuccess("✅ आपका संदेश सफलतापूर्वक भेज दिया गया है। धन्यवाद!");
      setForm({ name: "", email: "", subject: "", message: "" });
      setFormErrors({});
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <>
      <Header />

      <div className="contact-page">
        <div className="contact-header">
          <h1>{content.title}</h1>
          {content.subTitle && <h2>{content.subTitle}</h2>}
        </div>

        <div className="container-fluid">
          <div 
            className="contact-description"
            dangerouslySetInnerHTML={{ __html: content.description }} 
          />

          <div className="contact-section">
            <div className="contact-left">
              <h2>संपर्क फॉर्म</h2>

              {formSuccess && <p className="successMsg">{formSuccess}</p>}

              <form onSubmit={handleSubmit} className="contact-form">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="आपका पूरा नाम" 
                  value={form.name} 
                  onChange={handleChange} 
                />
                {formErrors.name && <p className="errorText">{formErrors.name}</p>}

                <input 
                  type="email" 
                  name="email" 
                  placeholder="ईमेल पता" 
                  value={form.email} 
                  onChange={handleChange} 
                />
                {formErrors.email && <p className="errorText">{formErrors.email}</p>}

                <input 
                  type="text" 
                  name="subject" 
                  placeholder="विषय" 
                  value={form.subject} 
                  onChange={handleChange} 
                />
                {formErrors.subject && <p className="errorText">{formErrors.subject}</p>}

                <textarea 
                  name="message" 
                  placeholder="आपका संदेश..." 
                  rows={5} 
                  value={form.message} 
                  onChange={handleChange} 
                />
                {formErrors.message && <p className="errorText">{formErrors.message}</p>}

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="contact-btn"
                >
                  {isSubmitting ? "भेजा जा रहा है..." : "संदेश भेजें 🐄"}
                </button>
              </form>
            </div>

            <div className="contact-right">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps?q=Pimpri-Chinchwad&output=embed"
                className="contact-map"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Contact;