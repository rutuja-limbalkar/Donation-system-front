import React from 'react'

function pageHead(props) {
  return (
    <div className='container my-3 text-center'>
    <h1>
      {props.title}
    </h1>
    </div>
  )
}

export default pageHead
