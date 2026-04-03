import React, { useState, useEffect } from 'react'
import Header from '../Component/Header';
import Footer from '../Component/footer';
import PageHead from '../Component/pageHead'
import PageSubHead from '../Component/pageSubHead'
import PageBody from '../Component/pageBody'
import { GetAction } from '../Component/GetAction'
import "../Style/contact.css"
function Contact() {

  const [getDetails, setDetails] = useState([])
  const [title, setTitle] = useState()
  const [subtitle, setSubTitle] = useState()
  const [markup, setMarkup] = useState()

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ API CALL
  const requestAPI = async () => {
    try {
      const response = await GetAction('get', { page_id: 2 }, `/pages/page`)
      if (!response) return;

      setDetails(response)
      setTitle(response.title)
      setSubTitle(response.subTitle)
      setMarkup(response.description)

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    requestAPI();
  }, []);

  const static_markup = { __html: markup };

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  // ✅ VALIDATION
  const validate = () => {
    let errors = {};
    if (!form.name.trim()) errors.name = "Name required";
    if (!form.email.trim()) errors.email = "Email required";
    if (!form.subject.trim()) errors.subject = "Subject required";
    if (!form.message.trim()) errors.message = "Message required";
    return errors;
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSuccess("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/api/contact/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.text();

      setFormSuccess("✅ " + data);
      setForm({ name: "", email: "", subject: "", message: "" });

    } catch (error) {
      setFormSuccess("❌ Failed to send message");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Header />
      <PageHead title={title} />
      <PageSubHead title={subtitle} />

      <div className='container-fluid'>

        <PageBody data={static_markup} />

        {/* ✅ CONTACT SECTION */}
        <div className="contact-section">

          {/* LEFT SIDE */}
          <div className="contact-left">

            <h2>Contact Us</h2>

            {formSuccess && (
              <p className="successMsg">{formSuccess}</p>
            )}

            <form onSubmit={handleSubmit} className="contact-form">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
              {formErrors.name && <p className="errorText">{formErrors.name}</p>}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              {formErrors.email && <p className="errorText">{formErrors.email}</p>}

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
              />
              {formErrors.subject && <p className="errorText">{formErrors.subject}</p>}

              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                value={form.message}
                onChange={handleChange}
              />
              {formErrors.message && <p className="errorText">{formErrors.message}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="contact-btn"
              >
                {isSubmitting ? "Sending..." : "Send Message 🐄"}
              </button>

            </form>
          </div>

          {/* RIGHT SIDE */}
          {/* RIGHT SIDE - Map */}
<div className="contact-right">
  <iframe
    title="Google Map - Pimpri Chinchwad"
    src="https://www.google.com/maps?q=Pimpri-Chinchwad&output=embed"
    className="contact-map"
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>
        </div>

      </div>

      <Footer />
    </>
  )
}

export default Contact;
/* ===== CONTACT PAGE ===== */

