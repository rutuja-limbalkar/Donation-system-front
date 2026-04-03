import React, { useState ,useEffect} from 'react'
import {Row,Col,Form} from 'react-bootstrap'
import Header from '../Component/Header';
import PageHead from '../Component/pageHead';
import Footer from '../Component/footer';
import {PostAction} from '../Component/PostAction';
import {useFormik} from 'formik';
import { useHistory } from 'react-router-dom';
import {GetAction} from '../Component/GetAction'

const initialformData = {
    id:sessionStorage.getItem('id')?sessionStorage.getItem('id'):'',
    firstName:sessionStorage.getItem('first_name')?sessionStorage.getItem('first_name'):'',
    lastName:sessionStorage.getItem('last_name')?sessionStorage.getItem('last_name'):'',
    email:sessionStorage.getItem('email_address')?sessionStorage.getItem('email_address'):'',
    mobile:sessionStorage.getItem('mobile')?sessionStorage.getItem('mobile'):'',
    adharCard:sessionStorage.getItem('adhar_card')?sessionStorage.getItem('adhar_card'):'',
    panNumber:sessionStorage.getItem('pan_number')?sessionStorage.getItem('pan_number'):'',
    address1:sessionStorage.getItem('address1')?sessionStorage.getItem('address1'):'',
    address2:sessionStorage.getItem('address2')?sessionStorage.getItem('address2'):'',
    city:sessionStorage.getItem('city')?sessionStorage.getItem('city'):'',
    country_id:sessionStorage.getItem('country_id')?sessionStorage.getItem('country_id'):'',
    country_name:sessionStorage.getItem('country_name')?sessionStorage.getItem('country_name'):'',
    state:sessionStorage.getItem('state')?sessionStorage.getItem('state'):'',
    state_name:sessionStorage.getItem('state')?sessionStorage.getItem('state'):'',
    zip_no:sessionStorage.getItem('zip_no')?sessionStorage.getItem('zip_no'):'',
  }
function Profile() {
    const [formData, setFormData] = useState(initialformData);
    const [counrtyData, setCountryData] = useState([]);
    const [listData, setListData] = useState([]);
    const [countryId, setCountryId] = useState(formData.country_id);
    const postUrl = "/user/saveUser"
    let history = useHistory()
    
    if(!sessionStorage.getItem('id')){
        history.push('/Login');
    }

    console.log(formData)
    const handleCountry = (event)=>{
        setCountryId(event.target.value)
            values.country_name = event.target[event.target.selectedIndex].getAttribute('data-name')
            callStateAPI();
        }
    
        useEffect(()=>{
        const callCountryAPI = async () => {
        const countryUrl = `/Master/countryList`;
        let reqParam = {
        }
        const res = await GetAction('get',reqParam,countryUrl)
        setCountryData(await res.response)
        }
        callCountryAPI();
        },[]);
    
        const callStateAPI = async () => {
        const stateUrl = `/Master/stateList`;
        let reqParam = {
            country_id:countryId,
        }
        const res = await GetAction('get',reqParam,stateUrl)
        setListData(await res.response)
        }
        useEffect(()=>{
            callStateAPI();
        },[countryId]);
    
        const changeState = (event) =>{
            values.state = event.target.value
            alert(event.target.value)
            values.state_name = event.target[event.target.selectedIndex].getAttribute('data-name')
            callStateAPI();
        }

    const {values,errors,touched,handleChange,handleBlur,handleSubmit,setFieldValue,} = useFormik({
        initialValues:formData,
        // validationSchema: donationSchema,
        onSubmit:(values)=>{
            console.log("Form Data",values)
          const callPOSTAPI = async () => {
          const res = await PostAction('post',values,postUrl)
            alert(res.message);
          }
          callPOSTAPI()
        }
      })
  return (
    <>
     <Header /> 
     <PageHead title="Profile" />
     <div className='container'  style={{fontSize:20,minHeight:"550px"}}>
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>
                <label className='form-label'>First Name</label>
                <input 
                className='form-control'
                type='text'
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                />
                </Col>
                <Col>
                <label className='form-label'>Last Name</label>
                <input 
                className='form-control'
                type='text'
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                />
                </Col>
            </Row>
            <Row>
                <Col>
                <label htmlFor="email">Email <span className="text-muted"></span></label>
                <input 
                type="email" 
                className="form-control" 
                name="email" 
                id="email" 
                value={values.email}
                onChange={handleChange}
                />
                </Col>
                <Col>
                <label htmlFor="mobile">Mobile <span className="text-muted"></span></label>
                <input 
                type="number" 
                className="form-control" 
                name="mobile" 
                id="mobile" 
                value={values.mobile}
                onChange={handleChange}
                />
                </Col>
            </Row>
            <Row>
                <Col>
                <label htmlFor="adharCard">Adhar Card Number</label>
                <input 
                type="text" 
                className="form-control" 
                name="adharCard" 
                id="adharCard" 
                value={values.adharCard}
                onChange={handleChange}
                min="1000000000000000" 
                max="9999999999999999"
                />
                </Col>
                <Col>
                <label htmlFor="panNumber">PAN Number</label>
                <input 
                type="text" 
                className="form-control" 
                name="panNumber" 
                id="panNumber"
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" 
                value={values.panNumber}
                onChange={handleChange}
                />
                </Col>
            </Row>
            <Row>
                <Col>
                <label htmlFor="address">Address</label>
                <input 
                type="text" 
                className="form-control" 
                name="address1" 
                id="address1"
                value={values.address1}
                onChange={handleChange} 
                />
                </Col>
                
            </Row>
            <Row>
                <Col>
                <label htmlFor="address2">Address 2 <span className="text-muted">(Optional)</span></label>
                <input 
                type="text" 
                className="form-control" 
                id="address2" 
                name="address2" 
                value={values.address2}
                onChange={handleChange} 
                />
                </Col>
                <Col>
                <label htmlFor="address">City</label>
                <input 
                type="text" 
                className="form-control" 
                name="city" 
                id="city" 
                value={values.city}
                onChange={handleChange}
                />
                </Col>
            </Row>
            <Row>
                <Col>
                <label htmlFor="country">Country</label>
                <select 
                className="form-control custom-select d-block w-100" 
                id="country" 
                name="country_id"
                onChange={(e)=>{
                    handleCountry(e)
                    handleChange(e)
                }}
                value={values.country_id}>
                    {counrtyData.map((country,index)=>
                    <option key={index} value={country.country_id} data-name={country.name}>{country.name}</option>
                    )}
                </select>
                </Col>
                <Col>
                <label htmlFor="state">State</label>
                <select 
                className="form-control custom-select d-block w-100" 
                id="state" 
                name="state"
                onChange={(e)=>{
                    changeState(e)
                    handleChange(e)
                }}
                value={values.state}>
                    {listData.map((state,index)=>
                    <option key={index} value={state.zone_id} data-name={state.name}>{state.name}</option>
                    )}
                </select>
                </Col>
                <Col>
                <label htmlFor="zip">Zip</label>
                <input 
                type="text" 
                className="form-control" 
                name="zip_no" 
                id="zip" 
                value={values.zip_no}
                onChange={handleChange}
                />
                </Col>
            </Row>
            <hr className="mb-4" />
            <center className='my-3'>
                <div md={4} xs={12}>
                <button className="btn btn-primary" type="submit">Update</button>
                </div>
            </center>
        </Form>
     </div>
     <Footer /> 
    </>
  )
}

export default Profile
