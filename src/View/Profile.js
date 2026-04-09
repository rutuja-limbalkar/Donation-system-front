import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import Header from '../Component/Header';
import PageHead from '../Component/pageHead';
import Footer from '../Component/footer';
import { PostAction } from '../Component/PostAction';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { GetAction } from '../Component/GetAction';

const initialformData = {
  id: sessionStorage.getItem('id') || '',
  firstName: sessionStorage.getItem('first_name') || '',
  lastName: sessionStorage.getItem('last_name') || '',
  email: sessionStorage.getItem('email_address') || '',
  mobile: sessionStorage.getItem('mobile') || '',
  adharCard: sessionStorage.getItem('adhar_card') || '',
  panNumber: sessionStorage.getItem('pan_number') || '',
  address1: sessionStorage.getItem('address1') || '',
  address2: sessionStorage.getItem('address2') || '',
  city: sessionStorage.getItem('city') || '',
  country_id: sessionStorage.getItem('country_id') || '',
  country_name: sessionStorage.getItem('country_name') || '',
  state: sessionStorage.getItem('state') || '',
  state_name: sessionStorage.getItem('state') || '',
  zip_no: sessionStorage.getItem('zip_no') || '',
};

function Profile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialformData);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [countryId, setCountryId] = useState(initialformData.country_id);

  const postUrl = "/user/saveUser";

  // 🔐 Auth check
  useEffect(() => {
    if (!sessionStorage.getItem('id')) {
      navigate('/login');
    }
  }, []);

  // 🌍 Load countries
  useEffect(() => {
    const fetchCountries = async () => {
      const res = await GetAction('get', {}, '/Master/countryList');
      setCountryData(await res.response);
    };
    fetchCountries();
  }, []);

  // 🌍 Load states
  useEffect(() => {
    if (!countryId) return;

    const fetchStates = async () => {
      const res = await GetAction('get', { country_id: countryId }, '/Master/stateList');
      setStateData(await res.response);
    };
    fetchStates();
  }, [countryId]);

  // 🧠 Formik
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: formData,
    enableReinitialize: true,

    onSubmit: async (values) => {
      const res = await PostAction('post', values, postUrl);
      alert(res.message);
    }
  });

  // 🌍 Country Change
  const handleCountry = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    setCountryId(e.target.value);

    setFieldValue('country_name', selectedOption.getAttribute('data-name'));
    setFieldValue('country_id', e.target.value);
  };

  // 🌍 State Change
  const handleState = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];

    setFieldValue('state', e.target.value);
    setFieldValue('state_name', selectedOption.getAttribute('data-name'));
  };

  return (
    <>
      <Header />
      <PageHead title="Profile" />

      <div className='container' style={{ fontSize: 18, minHeight: "550px" }}>
        <Form onSubmit={handleSubmit}>

          <Row>
            <Col>
              <label>First Name</label>
              <input className='form-control' name="firstName" value={values.firstName} onChange={handleChange} />
            </Col>

            <Col>
              <label>Last Name</label>
              <input className='form-control' name="lastName" value={values.lastName} onChange={handleChange} />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <label>Email</label>
              <input type="email" className="form-control" name="email" value={values.email} onChange={handleChange} />
            </Col>

            <Col>
              <label>Mobile</label>
              <input type="number" className="form-control" name="mobile" value={values.mobile} onChange={handleChange} />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <label>Aadhar Card</label>
              <input className="form-control" name="adharCard" value={values.adharCard} onChange={handleChange} />
            </Col>

            <Col>
              <label>PAN Number</label>
              <input className="form-control" name="panNumber" value={values.panNumber} onChange={handleChange} />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <label>Address</label>
              <input className="form-control" name="address1" value={values.address1} onChange={handleChange} />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <label>Address 2</label>
              <input className="form-control" name="address2" value={values.address2} onChange={handleChange} />
            </Col>

            <Col>
              <label>City</label>
              <input className="form-control" name="city" value={values.city} onChange={handleChange} />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <label>Country</label>
              <select
                className="form-control"
                name="country_id"
                value={values.country_id}
                onChange={(e) => {
                  handleCountry(e);
                  handleChange(e);
                }}
              >
                <option value="">Select Country</option>
                {countryData.map((c, i) => (
                  <option key={i} value={c.country_id} data-name={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Col>

            <Col>
              <label>State</label>
              <select
                className="form-control"
                name="state"
                value={values.state}
                onChange={(e) => {
                  handleState(e);
                  handleChange(e);
                }}
              >
                <option value="">Select State</option>
                {stateData.map((s, i) => (
                  <option key={i} value={s.zone_id} data-name={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Col>

            <Col>
              <label>Zip</label>
              <input className="form-control" name="zip_no" value={values.zip_no} onChange={handleChange} />
            </Col>
          </Row>

          <hr />

          <center className='my-3'>
            <button className="btn btn-primary">Update Profile</button>
          </center>

        </Form>
      </div>

      <Footer />
    </>
  );
}

export default Profile;