import React from 'react'

function footer() {
  return (
    <footer>
    <div className="container">
      <div className="row">
        <div className="col-12 col-sm-12 col-md col-lg col-xl">
          <img src="assets/images/logo.png" style={{float:"left"}}/>
          <div className="margintop46">श्री आचार्य विद्यासागर <br />जीवदया ट्रस्ट
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md col-lg col-xl">
          <div><img src="assets/images/icons/icon_location.png" width="35px" className="marginb10"/></div>
          <p >फ्लैट नंबर १, वीतराग,
            सेक. २४, प्लाट नंबर ६, निगड़ी प्राधिकरण,
            निगड़ी, पुणे - ४११०४४
          </p>
        </div>
        <div className="col-12 col-sm-12 col-md col-lg col-xl">
          <div>
            <img src="assets/images/icons/icon_phone.png" width="35px" className="marginb10"/>
          </div>
          <p>०२० २७६५३१५४</p>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default footer
