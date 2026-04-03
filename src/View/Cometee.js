import React, { useState ,useEffect} from 'react'
import Header from '../Component/Header';
import Footer from '../Component/footer';
import PageHead from '../Component/pageHead'
import PageBody from '../Component/pageBody'
import {GetAction} from '../Component/GetAction'

function Cometee() {
  const [getDetails,setDetails] = useState([])
  const [title,setTitle] = useState()
  const [subtitle,setSubTitle] = useState()
  const [markup,setMarkup] = useState()

    const requestAPI = async () => {
        const url = `/pages/page`;
        let reqParam = {
            page_id:3,
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
    <div className='container text-center' style={{fontSize:20,minHeight:"550px"}}>
    {markup?<PageBody data={static_markup} />:null}
     </div>
     <Footer /> 
    </>
  )
}

export default Cometee
