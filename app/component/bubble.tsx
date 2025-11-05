import React from 'react'

const Bubble = ({message}) => {
    const {content, role} = message
  return (
    <div>
      {content}
    </div>
  )
}

export default Bubble
