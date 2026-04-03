import React, { useState ,useEffect} from 'react'
import {Row,Col,Form} from 'react-bootstrap'
import Header from '../Component/Header';
import PageHead from '../Component/pageHead';
import Footer from '../Component/footer';
import {useFormik} from 'formik';
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import {PostAction} from '../Component/PostAction';
import { useHistory } from "react-router-dom";
import DataTables from '../Component/DataTables'
import {GetAction} from '../Component/GetAction';
import Loader from '../Component/Loader';
import PaymentReceipt from './PaymentReceipt';

function DonationHistory() {
    const [listData, setListData] = useState([]);
    const url = "donation/DonationHistory"
    let history = useHistory();
    const columns = [
    { name: "Sr.no", selector: (row) => row.index ,width:'5%'},
    { name: "Donation Type", selector: (row) => row.type_name, sortable: true },
    { name: "Mode Of Payment", selector: (row) => row.mode_of_payment, sortable: true},
    { name: "Amount", selector: (row) => row.payment_amount, sortable: true },
    { name: "Payment Date", selector: (row) => row.created_at, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        [<button className="btn btn-sm btn-danger" onClick={() => exportPdf(row)}>
          <i className='fa fa-file-pdf-o'></i>
        </button>]
        
      ),width:'15%'
    },
  ];
   const [loader, setLoader] = useState(true);
   const [modal, setModal] = useState(false);
   const [pdfData, setPDFData] = useState();
   const [paymentId, setPaymentId] = useState();
   const title = "Donation History"
   const tableTitle = "Donation List" 
   const searchColumn = ""
   useEffect(()=>{
    const userlAPI = async () => {
        const userUrl = `donation/DonationHistory`;
        let reqParam = {
            user_id:sessionStorage.getItem('id'),
        }
        const res = await GetAction('get',reqParam,userUrl)
        const response = await res.response
        // console.log("response",response)
        setListData(response)
        setLoader(false)
        }
        userlAPI();
    },[]);  
    
    const exportPdf = (row) => {
        setPDFData(row)
        return setModal(true)
    }
    
    if(!sessionStorage.getItem('id')){
    history.push('/Login');
    }

    if(loader){
        return(
        <>
        <Loader title={title} pageTitle={tableTitle} />
        
        </>
        );
      } 
  return (
    <>
    <Header />
    <PageHead title="Donation History" />
    <div className='container'  style={{fontSize:20,minHeight:"615px"}}>
    <DataTables columns={columns} title={tableTitle} searchColumn = {searchColumn} editAction="" deleteAction="" tvalue={listData}/>
    </div>
    {modal===true?<PaymentReceipt hide={() =>setModal(false)} title={title} data={pdfData} />:null}
    <Footer />
    </>
  )
}

export default DonationHistory
