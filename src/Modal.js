import styled from '@emotion/styled'
import React from 'react'
import ReactDOM from 'react-dom'
import Colors from './Colors'
import Icons from './Icon'
import LinkButton from './LinkButton'

function Modal ({ visible, onClose, children }) {
  const backdrop = React.useRef()

  const [opacity, setOpacity] = React.useState(0)

  React.useEffect(
    () => {
      setOpacity(visible ? 1 : 0)
    },
    [visible]
  )

  function onBackdropClick (e) {
    if (e.target === backdrop.current) {
      onClose()
    }
  }

  if (!visible) {
    return false
  }

  return ReactDOM.createPortal(
    <Backdrop ref={backdrop} opacity={opacity} onMouseDown={onBackdropClick}>
      <ModalClose onClick={onClose}><Icons.Cross /></ModalClose>
      <ModalContainer>
        {children}
      </ModalContainer>
    </Backdrop>,
    document.getElementById('root')
  )
}

const Backdrop = styled('div')({
  position: 'fixed',
  zIndex: 10000,
  top: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'auto',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(2px)',
  transition: 'opacity 0.2s'
}, ({ opacity }) => ({
  opacity
}))

const ModalContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  width: '60%',
  minWidth: 480,
  margin: '0 auto',
  paddingTop: '6%',
  paddingBottom: 32,
  color: Colors.foregroundLight
})

const ModalClose = styled(LinkButton.Decline)({
  fontSize: 32,
  position: 'absolute',
  top: 0,
  right: 0,
  width: 64,
  height: 64,
  padding: 0
})

export default Modal
