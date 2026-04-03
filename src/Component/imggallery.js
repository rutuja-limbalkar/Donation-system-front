import React from 'react'
import CardBody from './CardBody';
import {Row,Col} from 'react-bootstrap'


function imggallery(props) {
  // Add default empty array if gallaryData is undefined
  const gallaryData = props.gallaryData || [];
  
  return (
    <>
      <section id="imggallery">
      <div className="container">
        <h5 className="text-center font-weight-bold mb-3 heading mt-3">गैलरी</h5>
        <ul id="myTabs" className="nav nav-pills nav-justified" role="tablist" data-tabs="tabs">
          {/* {gallaryData.map((element,index)=>(
            <li><a href={`#gallary${index}`} data-toggle="tab" ></a></li>
          ))} */}
          {gallaryData.map((element, index) => {
            return <Col key={index}><li key={index}><CardBody key={element.gallary_id} src={element.gallary_images?.[0]?.path || ''} title={element.title} index={index} images={element.gallary_images || []} /> </li></Col>;
            // return null;
          })}
        </ul>
        <div className="tab-content mt-3">
        {gallaryData.map((element,index)=>{
         return <div key={index} role="tabpanel" className="tab-pane" id={`gallary${index}`}>
            <div className="container">
              <div className="row">
                {
                  element.gallary_images && element.gallary_images.length > 0 ? element.gallary_images.map((img,i) => (
                    <div key={i} className="col-12 col-sm-12 col-md col-lg col-xl">
                      <a href={img.path} data-toggle="lightbox" data-gallery="gallery" className="col-md-4">
                      <img src={img.path} className="img-fluid rounded" alt={`Gallery ${index} image ${i+1}`} />
                      </a>
                  </div>
                  )): <div className="col-12 text-center">No images available</div>
                }
              </div>
            </div>
          </div>
        })}
      </div>
      </div>
    </section>
    </>
  )
}

export default imggallery