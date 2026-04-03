import React, { useState ,useEffect} from 'react'
import Header from '../Component/Header';
import Footer from '../Component/footer';
import PageHead from '../Component/pageHead'
import PageBody from '../Component/pageBody'
import {Row,Col,Form} from 'react-bootstrap'
import {PostAction} from '../Component/PostAction';
import {useFormik} from 'formik';
// import {GetAction} from '../Component/GetAction'

const initialformData = {
  goshala_name:'',
  contact_person:'',
  contact_number:'',
  help_type:'',
  other_information:'',
}
function Help() {
  const title = "गौ शाला मदत"
  const markup = { __html: '' };
  const [formData, setFormData] = useState(initialformData);
  const [visibleOther, setVisibleOther] = useState(false);
  const postUrl = "/donation/goshalaHelp"

  const handleTypeChange = (e) =>{
    if(e.target.value==="other"){
      setVisibleOther(true)
    }else{
      setVisibleOther(false)
      values.other_information = ''
    }
  }
  const {values,errors,touched,handleChange,handleBlur,handleSubmit,setFieldValue,} = useFormik({
    initialValues:formData,
    // validationSchema: donationSchema,
    onSubmit:(values)=>{
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
    <PageHead title={title} />
    <div className='container' style={{fontSize:25,minHeight:"550px"}}>
    <PageBody data={markup} />
    <Form onSubmit={handleSubmit}>
    <Row>
      <Col>
      <label className='form-label'>गौशाला का नाम *</label>
      <input
      className='form-control'
      type="text"
      name="goshala_name"
      value={values.goshala_name}
      onChange={handleChange}
      />
      </Col>
    </Row>
     <Row>
      <Col>
      <label className='form-label'>संपर्क व्यक्ति *</label>
      <input
      className='form-control'
      type="text"
      name="contact_person"
      value={values.contact_person}
      onChange={handleChange}
      />
      </Col>
    </Row>
     <Row>
      <Col>
      <label className='form-label'>संपर्क फ़ोन *</label>
      <input
      className='form-control'
      type="number"
      name="contact_number"
      value={values.contact_number}
      onChange={handleChange}
      />
      </Col>
    </Row>
    
      <Row>
      <Col>
      <label className='form-label'>सहायता *</label>
      </Col>
    </Row>
    <Row>
      <Col>
      <input
      className='form-checkbox mx-3'
      type="radio"
      value="चारा"
      name="help_type"
      onChange={(e) =>{
        handleTypeChange(e)
        handleChange(e)
      }
      }
      />
      <label className='form-label'>चारा</label>
      </Col>
    </Row>
    <Row>
      <Col>
      <input
      className='form-checkbox mx-3'
      type="radio"
      value="शेड"
      name="help_type"
      onChange={(e) =>{
        handleTypeChange(e)
        handleChange(e)
      }
      }
      />
      <label className='form-label'>शेड</label>
      </Col>
    </Row>
    <Row>
      <Col>
      <input
      className='form-checkbox mx-3'
      type="radio"
      value="मेडिकल"
      name="help_type"
      onChange={(e) =>{
        handleTypeChange(e)
        handleChange(e)
      }
      }
      />
      <label className='form-label'>मेडिकल</label>
      </Col>
    </Row>
    <Row>
      <Col>
      <input
      className='form-checkbox mx-3'
      type="radio"
      value="other"
      name="help_type"
      onChange={(e) =>{
        handleTypeChange(e)
        handleChange(e)
      }
      }
      />
      <label className='form-label'>अन्य</label>
      </Col>
    </Row>
     {visibleOther?<Row>
      <Col>
      <label className='form-label'>अन्य जानकारी</label>
      <textarea
      className='form-control'
      type="text"
      value={values.other_information}
      cols="60"
      rows="5"
      name="other_information"
      onChange={handleChange}
      />
      </Col>
    </Row>:null}
    <center className='my-3'>
        <div md={4} xs={12}>
        <button className="btn btn-primary" type="submit">Submit</button>
        </div>
    </center>
    </Form>
    </div>
     <Footer /> 
    </>
  )
}

export default Help
