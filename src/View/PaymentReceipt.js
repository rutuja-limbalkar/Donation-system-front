import React, { useState ,useRef} from 'react'
import {Row,Col} from 'react-bootstrap'
import { useReactToPrint } from 'react-to-print'

function PaymentReceipt(props) {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle:'receipt-data',
    onAfterPrint: () => alert('Print Success')
  })
  console.log(props)
  let modalStyle ={
    display: 'block',
    backgroundColor: 'rgba(0,0,0,0,8)',
  }


  return (
    <>
     <div
      className="modal"
      style={modalStyle}
    >
    <div className='modal-dialog modal-xl modal-dialog-centered'>
      <div className='modal-content'>
        <div className='modal-header'>
        <h5 className='modal-title'><b>Payment Receipt</b></h5>
        <button className='btn-close' type="button" onClick={props.hide} ><i className='fa fa-close'></i></button>
        </div>
        <div className='modal-body'>
        <div className='continer my-3' ref={componentRef} style={{width:'100%'}}>
        <table  width="100%;" border="0" align="center" cellSpacing="2" cellPadding="1" style={{marginBottom: "5px"}}  id="pdfBody">           
            <tbody>
                <tr>
                    <td align="center">
                            <img src='assets/images/jivdaya-logo.png' style={{width: "60px"}}/>
                        </td>
                        <td align="center"><b style={{fontSize: "20px",marginRight:"50px",color:"#f94f4f"}} >Payment Receipt</b></td>
                        <td align="center">
                            <img src="assets/images/Jainism.svg.png" style={{width: "40px"}}/>
                        </td>

                </tr>
                <tr>
                    <td align="center" colSpan={3}><b style={{fontSize: "15px",color:"#f94f4f"}}>वीतराग,सेक.२४,प्लाट नंबर ६,निगड़ी प्राधिकरण,निगड़ी, पुणे - ४११०४४</b></td>
                </tr>
                <tr>
                    <td align="center" colSpan={3}><b style={{fontSize: "12px",color:"#f94f4f"}}>रजिस्टर नंबर : महा. ३७०/२०१४/पुणे @ visit us on:www.jeevdaya.net</b></td>
                </tr>
                <tr>
                    <td colSpan={3}><table border="1" align="center" style={{fontSize: "12px"}}>
                        <tr>
                            <td style={{width: "200px",border:"1px solid"}}><b>आयकर अधिनियम कि धारा 80G के अंतर्गत रजिस्टर्ड </b></td>
                            <td style={{width: "200px",border:"1px solid"}}><b>DI No. AAO TS 1209 HE 2021901<br />UR No. AAO TS 1209 HE 20219</b></td>
                            <td style={{width: "200px",border:"1px solid"}}><b>DI No. AAO TS 1209 HF 2021701<br />UR No. AAO TS 1209 HF 20217</b></td>
                        </tr>
                    </table></td>
                </tr>
            </tbody>
        </table>
        <hr />
        <table  width="90%;" border="0" align="center" cellSpacing="2" cellPadding="2" style={{fontSize: "12px"}}>            
            <tbody>         
                <tr>
                    <td width="70%;" colSpan={2}><b style={{fontSize: '12px',color: '#f94f4f'}}>Receipt no: </b>{props.data.order_id}</td>
                    <td><b style={{fontSize: '12px',color: '#f94f4f'}}>Date: </b>{props.data.created_at}</td>
                    
                </tr>
            </tbody>
        </table>
        <hr />
        <table border="0" align="center" width="90%" cellSpacing="2" cellPadding="2" >
            <tr>
                <td colSpan="2"><span style={{fontSize: '12px',color: '#f94f4f'}}>Received with thanks from </span><span className="mx-4" style={{fontSize: '12px',textAlign: 'center'}}>{props.data.name}</span></td>
            </tr>
            <tr>
                <td>
                <span style={{fontSize: '12px',color: '#f94f4f'}}>Address </span><span className="mx-4"  style={{fontSize: "12px"}}>{props.data.address1}</span>
                {props.data.address2?<>, <span style={{fontSize: "12px"}}>{props.data.address2}</span></>:null}
                </td>
                <td>
                <span style={{fontSize: '12px',color: '#f94f4f'}}>Cell: </span><span className="mx-4" style={{fontSize: "12px"}}>{props.data.mobile}</span>
                </td>
            </tr>
            <tr>
                <td>
                <span style={{fontSize: '12px',color: '#f94f4f'}}>the sum of Rupees </span><span className="mx-4" style={{fontSize: "12px"}}> {props.data.amount_in_words}</span>
                </td>
                <td>
                </td>
            </tr>
            <tr>
                <td>
                <span style={{fontSize: '12px',color: '#f94f4f'}}>by </span> <span className="mx-4" style={{fontSize: "12px"}}>{props.data.mode_of_payment}</span>
                <span style={{fontSize: '12px',color: '#f94f4f'}}>Txn. No.: </span><span style={{fontSize: "12px"}}>{props.data.transaction_id}</span>
                </td>
                <td>
                <span style={{fontSize: '12px',color: '#f94f4f'}}>dated: </span> <span className="mx-4" style={{fontSize: "12px"}}>{props.data.created_at}</span>
                </td>
            </tr>
            <tr>
                <td>
            {(props.data.mode_of_payment==='Cheque')?<><span style={{fontSize: '12px',color: '#f94f4f'}}>drawn on Bank: </span><span className="mx-4" style={{fontSize: '12px'}}>{props.data.bank_name}</span></>:null}
                </td>
                <td>
                </td>
            </tr>
        </table>
        <hr />
        <table  width="90%;" border="0" align="center" cellSpacing="1" cellPadding="1" style={{fontSize: '12px'}}>            
            <tbody> 
            <tr>
                <td width="30%;">
                    <table width="90%" align="center" border="1">
                      <tr>
                        <td width="20%"  style={{borderRight:'1px solid',textAlign: 'center'}}><b style={{fontSize: '20px',color: '#f94f4f'}}>₹: </b></td>
                        <td style={{textAlign: 'center'}}><b style={{fontSize:'20px'}}>{props.data.payment_amount}</b></td></tr></table>
                    </td>
                
                <td  width="70%;" ></td>
            </tr>
            <tr><td></td><td></td></tr>        
            <tr>
                <td  width="60%;">
                    {props.data.mode_of_payment==='Cheque'?<span style={{fontSize: '12px',color: '#f94f4f'}}> * Subject to realisation of Cheque.</span>:null}
           
                </td>
                <td><b style={{fontSize: '12px',color: '#f94f4f',textAlign: 'right'}}>Payment Receipt.</b></td>
              </tr>
            </tbody>
        </table>
        </div>
        <center>
          <button type='button' onClick={handlePrint} className="btn btn-rounded btn-primary">Download PDF</button>
        </center>
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default PaymentReceipt
