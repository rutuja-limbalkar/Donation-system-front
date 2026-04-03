import React from 'react'

function pageBody(props) {
  return (
    <div dangerouslySetInnerHTML={props.data} />
  )
}

export default pageBody
