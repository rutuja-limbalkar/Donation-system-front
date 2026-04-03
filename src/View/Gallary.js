import React,{ useState ,useEffect}  from 'react'
import Header from '../Component/Header';
import Card from '../Component/CardBody';
import Footer from '../Component/footer';
import {Row,Col} from 'react-bootstrap'
import {GetAction} from '../Component/GetAction'
import Imggallery from '../Component/imggallery';

function Gallary() {
  const [getDetails,setDetails] = useState([])
  
  const requestAPI = async () => {
    const url = `/gallary/gallaryList`;
    let reqParam = {
    }
    const res = await GetAction('get',reqParam,url)
    const response = await res.response
    // console.log("response",response)
    setDetails(response)
   
    }
useEffect(()=>{
    requestAPI();
},[]);  

  return (
    <>
    <Header />
    <div className='container my-3'  style={{fontSize:25,minHeight:"600px"}}>
    {/* <Row className='my-3'>
    {getDetails.map((element, index) => {
      if (element.gallary_images.length >0) {
        return <Col key={index}> <Card key={element.gallary_id} src={element.gallary_images[0]?.path} title={element.title} images={element.gallary_images} /></Col>;
      }
      // return null;
    })}
    
    </Row>  */}
    <Imggallery gallaryData={getDetails} />
    </div>
     <Footer /> 
    </>
  )
}

export default Gallary
