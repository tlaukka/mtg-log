import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'

function Popup ({ content, openOnHover = true, children }) {
  const [visible, setVisible] = React.useState(false)

  function onMouseEnter () {
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {visible && React.cloneElement(content)}
      {children}
    </PopupContainer>
  )
}

export function withPopupPosition (WrappedComponent) {
  return function (props) {
    const container = React.useRef()

    const [position, setPosition] = React.useState('bottom')

    React.useEffect(
      () => {
        const rect = container.current.getBoundingClientRect()
        const pos = ((rect.y + rect.height) > window.innerHeight) ? 'top' : 'bottom'

        setPosition(pos)
      },
      []
    )

    return (
      <WrappedComponent
        ref={container}
        style={popupStyles}
        position={position}
        {...props}
      />
    )
  }
}

const popupStyles = {
  position: 'absolute',
  left: '100%',
  zIndex: 100,
  marginLeft: 4
}

const PopupContainer = styled('div')({
  position: 'relative',
  display: 'inline-block'
})

export default Popup
