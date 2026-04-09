import React, { useState } from 'react';
import Header from '../Component/Header';
import Footer from '../Component/footer';
import PageHead from '../Component/pageHead';
import PageBody from '../Component/pageBody';
import { Row, Col, Form, Card, Button, Container } from 'react-bootstrap';
import { PostAction } from '../Component/PostAction';
import { useFormik } from 'formik';

const initialformData = {
  gaushalaName: '',
  contactPerson: '',
  contactPhone: '',
  helpType: '',
  other_information: '',
};

function GaushalaHelp() {

  const title = <h3 style={{ color: '#FF4500', fontWeight: 'bold', marginTop: '50px' }}>
  गौशाला सहायता फॉर्म 
</h3>;

  const markup = { __html: '' };
  const [visibleOther, setVisibleOther] = useState(false);
 const postUrl = "http://localhost:8080/gaushala";
  const styles = {
    mainContainer: {
      backgroundColor: '#f4f7f6',
      paddingBottom: '50px',
      minHeight: '70vh'
    },
    card: {
      borderRadius: '15px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      border: 'none',
      background: '#ffffff',
      padding: '20px',
      marginTop: '30px'
    },
    label: {
      fontSize: '1.05rem',
      fontWeight: '600',
      color: '#333',
      marginBottom: '8px',
      display: 'block'
    },
    input: {
      borderRadius: '8px',
      padding: '12px',
      border: '1px solid #ced4da',
      fontSize: '1rem',
      transition: 'all 0.3s'
    },
    radioContainer: {
      background: '#fcfcfc',
      padding: '20px',
      borderRadius: '12px',
      border: '1px dashed #ddd',
      marginTop: '10px'
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #FF8C00 0%, #FF4500 100%)',
      border: 'none',
      padding: '14px 50px',
      fontSize: '1.1rem',
      fontWeight: '700',
      borderRadius: '50px',
      boxShadow: '0 4px 15px rgba(255, 69, 0, 0.3)',
      marginTop: '20px'
    }
  };

  const handleTypeChange = (e, setFieldValue) => {
    const value = e.target.value;
    if (value === "other") {
      setVisibleOther(true);
    } else {
      setVisibleOther(false);
      setFieldValue("other_information", "");
    }
  };

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialformData,
    onSubmit: async (values) => {
      try {
        const res = await PostAction("post", values, postUrl);
        alert(res?.message || "Successfully Sent / सफलतापूर्वक भेजा गया");
      } catch (err) {
        console.error(err);
        alert("Error while submitting / जमा करने में त्रुटि");
      }
    }
  });

  return (
    <div style={{ backgroundColor: '#f4f7f6' }}>
      <Header />
      <PageHead title={title} />

      <Container style={styles.mainContainer}>
        <Row className="justify-content-center">
          
          {/* ✅ FORM WIDTH ADJUSTED */}
          <Col lg={6} md={8}>
            
            <Card style={styles.card}>
              <Card.Body>
                <div className="text-center mb-4">
                  <PageBody data={markup} />
                  <p className="text-muted">कृपया नीचे दी गई जानकारी भरें</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  
                  {/* GAUSHALA NAME */}
                  <Form.Group className="mb-4">
                    <label style={styles.label}>गौशाला का नाम :</label>
                    <Form.Control
                      style={styles.input}
                      type="text"
                      name="gaushalaName"
                      placeholder="गौशाला का नाम लिखें"
                      value={values.gaushalaName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* CONTACT PERSON */}
                  <Form.Group className="mb-4">
                    <label style={styles.label}>संपर्क व्यक्ति :</label>
                    <Form.Control
                      style={styles.input}
                      type="text"
                      name="contactPerson"
                      placeholder="नाम लिखें"
                      value={values.contactPerson}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* ✅ CONTACT PHONE BELOW PERSON */}
                  <Form.Group className="mb-4">
                    <label style={styles.label}>संपर्क फ़ोन :</label>
                    <Form.Control
                      style={styles.input}
                      type="number"
                      name="contactPhone"
                      placeholder="मोबाइल नंबर"
                      value={values.contactPhone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* HELP TYPE */}
                  <Form.Group className="mb-4">
                    <label style={styles.label}>किस प्रकार की सहायता चाहिए? </label>
                    <div style={styles.radioContainer}>
                      <Row>
                        {["चारा", "शेड", "मेडिकल", "other"].map((item, i) => (
                          <Col xs={6} md={3} key={i} className="mb-2">
                            <Form.Check
                              type="radio"
                              name="helpType"
                              id={`help-${i}`}
                              label={item === "other" ? "अन्य" : item}
                              value={item}
                              onChange={(e) => {
                                handleChange(e);
                                handleTypeChange(e, setFieldValue);
                              }}
                              style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </Form.Group>

                  {/* OTHER INFO */}
                  {visibleOther && (
                    <Form.Group className="mb-4">
                      <label style={styles.label}>अन्य विवरण (Other Details)</label>
                      <Form.Control
                        as="textarea"
                        style={styles.input}
                        name="other_information"
                        value={values.other_information}
                        onChange={handleChange}
                        rows={3}
                        placeholder="विस्तार से लिखें..."
                      />
                    </Form.Group>
                  )}

                  {/* SUBMIT BUTTON */}
                  <div className='text-center'>
                    <Button 
                      style={styles.submitBtn} 
                      type="submit"
                      className="btn-hover-effect"
                    >
                      जमा करें (Submit)
                    </Button>
                  </div>

                </Form>
              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>

      <Footer />

      <style>{`
        .form-control:focus {
          border-color: #FF8C00 !important;
          box-shadow: 0 0 0 0.2rem rgba(255, 140, 0, 0.15) !important;
        }
        .btn-hover-effect:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default GaushalaHelp;