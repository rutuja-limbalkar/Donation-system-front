import React, { useState ,useEffect} from 'react'
import Header from '../Component/Header';
import Footer from '../Component/footer';
import PageHead from '../Component/pageHead'
import PageBody from '../Component/pageBody'
import {Form} from 'react-bootstrap'
import {PostAction} from '../Component/PostAction';
import {useFormik} from 'formik';
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
    country_id:sessionStorage.getItem('country_id')?sessionStorage.getItem('country_id'):'99',
    country_name:sessionStorage.getItem('country_name')?sessionStorage.getItem('country_name'):'India',
    state:sessionStorage.getItem('state')?sessionStorage.getItem('state'):'',
    state_name:sessionStorage.getItem('state')?sessionStorage.getItem('state'):'',
    zip_no:sessionStorage.getItem('zip_no')?sessionStorage.getItem('zip_no'):'',
    product_id:'',
    product_name:'',
    same_address:'',
    save_info:'',
    donation_amount:'',
  }

function Donation() {
const markup = { __html: '<p>आप हमें आपकी दान राशी यहाँ से भी सीधे भेज सकते है | ऑनलाइन दान से संबधी किसी भी प्रकार की जानकारी के लिए सपर्क करे ०८९८३ ७८३ ७८३ |</p>' };
const [getDetails,setDetails] = useState([])
const [title,setTitle] = useState("ऑनलाइन दान")
const [subtitle,setSubTitle] = useState()
const [countryId, setCountryId] = useState('99');
const [formData, setFormData] = useState(initialformData);
const [counrtyData, setCountryData] = useState([]);
const [listData, setListData] = useState([]);
const postUrl = "/donation/checkout"

  const requestAPI = async () => {
      const url = `/donation_type/donationTypes`;
      let reqParam = {
          page_id:1,
      }
      const res = await GetAction('get',reqParam,url)
      const response = await res.response
      setDetails(response)
      // console.log("response",response)
      }
useEffect(()=>{
      requestAPI();
  },[]);  

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
console.log(values)
  return (
    <>
    <Header /> 
    <PageHead title="ऑनलाइन दान" />
    <Form onSubmit={handleSubmit}>
    <div className='container'  style={{fontSize:20,minHeight:"550px"}}>
    <PageBody data={markup} />
    <hr className="mb-4" />
    <div className="services">
      <div className="container">
          <div className="row">
              <div className="col-md-12 service-item">
                  <div className="row">
                        <div className="col-md-6 mb-3">
                        <label className='form-label mx-3'>दान राशी </label>
                        <select
                        className='form-control'
                        id="product_id"
                        name="product_id"
                        value={values.product_id}
                        onChange={(e)=>{
                            const amount = e.target[e.target.selectedIndex].getAttribute('data-amount')
                            values.donation_amount = amount
                            values.product_name = e.target[e.target.selectedIndex].getAttribute('data-name')
                            handleChange(e)
                        }}
                        >
                        {getDetails.map((item,index)=>(
                            <option key={item.index} value={item.donation_type_id} data-amount={item.amount} data-name={item.name}>{item.name}</option>
                        ))

                        }
                        </select>
                        </div>
                    </div>
                  <h4 className="mb-3">Billing address</h4>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="firstName">First name</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            name="firstName" 
                            id="firstName" 
                            value={values.firstName}
                            onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="lastName">Last name</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            name="lastName" 
                            id="lastName" 
                            value={values.lastName}
                            onChange={handleChange}
                            />
                            </div>
                    </div>
                    <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="email">Email <span className="text-muted"></span></label>
                        <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        id="email" 
                        value={values.email}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="mobile">Mobile <span className="text-muted"></span></label>
                        <input 
                        type="number" 
                        className="form-control" 
                        name="mobile" 
                        id="mobile" 
                        value={values.mobile}
                        onChange={handleChange}
                        />
                    </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
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
                        </div>
                        <div className="col-md-6 mb-3">
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
                        {errors.panNumber?<span id="lblPANCard" className="text-danger">Invalid PAN Number</span>:null}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address">Address</label>
                        <input 
                        type="text" 
                        className="form-control" 
                        name="address1" 
                        id="address1"
                        value={values.address1}
                        onChange={handleChange} 
                        />
                    </div>
                    <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="address2">Address 2 <span className="text-muted">(Optional)</span></label>
                        <input 
                        type="text" 
                        className="form-control" 
                        id="address2" 
                        name="address2" 
                        value={values.address2}
                        onChange={handleChange} 
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="address">City</label>
                        <input 
                        type="text" 
                        className="form-control" 
                        name="city" 
                        id="city" 
                        value={values.city}
                        onChange={handleChange}
                        />
                    </div>
                    </div>
                    <div className="row">
                        <div className="col-md-5 mb-3">
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
                
                        </div>
                        <div className="col-md-4 mb-3">
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
                        </div>
                        <div className="col-md-3 mb-3">
                            <label htmlFor="zip">Zip</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            name="zip_no" 
                            id="zip" 
                            value={values.zip_no}
                            onChange={handleChange}
                            />
                        </div>
                    </div>
                    <hr className="mb-4" />
                    <div className="custom-control custom-checkbox">
                        <input 
                        type="checkbox" 
                        className="custom-control-input" 
                        id="same-address" 
                        name="same_address"
                        value="Y"
                        onChange={handleChange}
                        />
                        <label className="custom-control-label" htmlFor="same-address">Shipping address is the same as my billing address</label>
                    </div>
                    <div className="custom-control custom-checkbox">
                        <input 
                        type="checkbox" 
                        className="custom-control-input" 
                        id="save-info" 
                        name="save_info"
                        value="Y"
                        onChange={handleChange}
                        />
                        <label className="custom-control-label" htmlFor="save-info">Save this information htmlFor next time</label>
                    </div>
                    <hr className="mb-4" />

                    <h4 className="mb-3">Payment</h4>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="cc-number">Donation Amount</label>
                        <input 
                        type="number" 
                        className="form-control" 
                        value={values.donation_amount}
                        onChange={handleChange} 
                        id="donation_amount" 
                        name="donation_amount"
                        />
                        
                    </div>
                    <hr className="mb-4" />
                    <center className='my-3'>
                        <div md={4} xs={12}>
                        <button className="btn btn-primary" type="submit">Continue to checkout</button>
                        </div>
                    </center>
              </div>
          </div>
      </div>
  </div>
  </div>
  </Form>
<Footer /> 
    </>
  )
}

export default Donation
