import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'

function Popup ({ content, openOnHover = false, children }) {
  const [visible, setVisible] = React.useState(false)

  function onClick (e) {
    e.stopPropagation()
    setVisible((value) => !value)
  }

  function onMouseOver () {
    if (openOnHover) {
      setVisible(true)
    }

    return null
  }

  function onMouseLeave () {
    if (openOnHover) {
      setVisible(false)
    }

    return null
  }

  return (
    <PopupContainer
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {visible && (
        <PopupContent>
          {React.cloneElement(content, { onClick })}
        </PopupContent>
      )}
      {children}
    </PopupContainer>
  )
}

const PopupContainer = styled('div')({
  position: 'relative'
})

const PopupContent = styled('div')({
  position: 'absolute',
  left: '100%',
  marginLeft: 4,
  padding: 8,
  borderRadius: 3,
  backgroundColor: Colors.borderLight
})

export default Popup
