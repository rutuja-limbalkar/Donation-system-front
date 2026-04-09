import React,{ useState ,useEffect}  from 'react'
import Header from '../Component/Header';
import Footer from '../Component/footer';
import Slider from '../Component/slider';
import AboutUs from '../Component/aboutUs';
import Kartavya from '../Component/kartavya';
import Udesh from '../Udesh/Udesh';
import Sankalp from '../Component/sankalp';
import DonateBg from '../Component/donateBg';
import Imggallery from '../Gallery/Imggallery';
import {GetAction} from '../Component/GetAction'


function Home() {
  const [getDetails,setDetails] = useState([])
  
  const requestAPI = async () => {
    const url = `/gallery`;
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
     <Slider /> 
     <AboutUs /> 
     <Kartavya /> 
     <Udesh /> 
     <Sankalp /> 
     <DonateBg /> 
     <Imggallery gallaryData={getDetails} /> 
     <Footer /> 
    </>
  )
}

export default Home
