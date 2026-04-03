import React, { useState ,useEffect} from 'react'
import {Button,Card} from 'react-bootstrap'

function CardBody(props) {
  const [isActive, setIsActive] = useState(false);
    const openGallary = ()=>{
        console.log("Opening Gallary...")
        setIsActive(current => !current);
    }
  return (
    <Card key={props.index} style={{ width: '18rem' }}>
      <Card.Img variant="top" src={props.src} />
      <a href={`#gallary${props.index}`} className={isActive ? 'active' : ''} onClick={openGallary} data-toggle="tab" > 
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
      </a>
    </Card>
  )
}

export default CardBody
