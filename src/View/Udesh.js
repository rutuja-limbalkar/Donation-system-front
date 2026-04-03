import React, { useState ,useEffect} from 'react'
import Header from '../Component/Header';
import Footer from '../Component/footer';
import PageHead from '../Component/pageHead'
import PageSubHead from '../Component/pageSubHead'
import PageBody from '../Component/pageBody'
import {GetAction} from '../Component/GetAction'

function Udesh() {
  const [getDetails,setDetails] = useState([])
  const [title,setTitle] = useState()
  const [subtitle,setSubTitle] = useState()
  const [markup,setMarkup] = useState()

    const requestAPI = async () => {
        const url = `/pages/page`;
        let reqParam = {
            page_id:1,
        }
        const res = await GetAction('get',reqParam,url)
        const response = await res.response
        // console.log("response",response)
        setDetails(response)
        setTitle(response.title)
        setSubTitle(response.subTitle)
        setMarkup(response.description)
        }
  useEffect(()=>{
        requestAPI();
    },[]);  
const static_markup = { __html: markup };
  return (
    <>
    <Header /> 
    <PageHead title={title} />
    <PageSubHead title={subtitle} />

    <div className='container' style={{fontSize:20,minHeight:"500px"}}>
    <PageBody data={static_markup} />
    </div>
     <Footer /> 
    </>
  )
}

export default Udesh
