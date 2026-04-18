import React, { useState } from 'react';
import PageHead from '../Component/pageHead';
import PageBody from '../Component/pageBody';
import { Row, Col, Form, Card, Button, Container } from 'react-bootstrap';
import { PostAction } from '../Component/PostAction';
import { useFormik } from 'formik';   // ← This line was missing

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

  const [visibleOther, setVisibleOther] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const postUrl = "http://localhost:8080/api/gaushala";

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

  const formik = useFormik({
    initialValues: initialformData,
    onSubmit: async (values) => {
      if (values.contactPhone.length !== 10) {
        alert("फोन नंबर 10 अंकों का होना चाहिए");
        return;
      }

      setSubmitting(true);
      try {
        const res = await PostAction("post", values, postUrl);
        alert(res?.message || "सफलतापूर्वक भेजा गया!");
        formik.resetForm();
        setVisibleOther(false);
      } catch (err) {
        console.error(err);
        alert("जमा करने में त्रुटि हुई");
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleTypeChange = (e) => {
    const value = e.target.value;
    formik.handleChange(e);
    if (value === "other") {
      setVisibleOther(true);
    } else {
      setVisibleOther(false);
      formik.setFieldValue("other_information", "");
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6' }}>
      <PageHead title={title} />

      <Container style={styles.mainContainer}>
        <Row className="justify-content-center">
          <Col lg={6} md={8}>
            <Card style={styles.card}>
              <Card.Body>
                <div className="text-center mb-4">
                  <PageBody data={{ __html: '' }} />
                  <p className="text-muted">कृपया नीचे दी गई जानकारी भरें</p>
                </div>

                <Form onSubmit={formik.handleSubmit}>
                  {/* Gaushala Name */}
                  <Form.Group className="mb-4">
                    <label style={styles.label}>गौशाला का नाम :</label>
                    <Form.Control
                      style={styles.input}
                      type="text"
                      name="gaushalaName"
                      placeholder="गौशाला का नाम लिखें"
                      value={formik.values.gaushalaName}
                      onChange={formik.handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Contact Person */}
                  <Form.Group className="mb-4">
                    <label style={styles.label}>संपर्क व्यक्ति :</label>
                    <Form.Control
                      style={styles.input}
                      type="text"
                      name="contactPerson"
                      placeholder="नाम लिखें"
                      value={formik.values.contactPerson}
                      onChange={formik.handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Contact Phone */}
                  <Form.Group className="mb-4">
                    <label style={styles.label}>संपर्क फ़ोन :</label>
                    <Form.Control
                      style={styles.input}
                      type="tel"
                      name="contactPhone"
                      placeholder="मोबाइल नंबर (10 अंक)"
                      value={formik.values.contactPhone}
                      onChange={formik.handleChange}
                      maxLength={10}
                      required
                    />
                  </Form.Group>

                  {/* Help Type */}
                  <Form.Group className="mb-4">
                    <label style={styles.label}>किस प्रकार की सहायता चाहिए?</label>
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
                              onChange={handleTypeChange}
                              style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                              required
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </Form.Group>

                  {/* Other Information */}
                  {visibleOther && (
                    <Form.Group className="mb-4">
                      <label style={styles.label}>अन्य विवरण</label>
                      <Form.Control
                        as="textarea"
                        style={styles.input}
                        name="other_information"
                        value={formik.values.other_information}
                        onChange={formik.handleChange}
                        rows={3}
                        placeholder="विस्तार से लिखें..."
                      />
                    </Form.Group>
                  )}

                  <div className='text-center'>
                    <Button 
                      style={styles.submitBtn} 
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? "जमा हो रहा है..." : "जमा करें (Submit)"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default GaushalaHelp;