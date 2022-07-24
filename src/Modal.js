import styled from '@emotion/styled'
import React from 'react'
import ReactDOM from 'react-dom'
import Colors from './Colors'
import Icons from './Icon'
import LinkButton from './LinkButton'

function Modal ({ visible, onClose, children }) {
  function handleClose (e) {
    e.stopPropagation()
    onClose()
  }

  if (!visible) {
    return false
  }

  return ReactDOM.createPortal(
    <Backdrop onClick={handleClose}>
      <ModalClose onClick={handleClose}><Icons.Cross /></ModalClose>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
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
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(2px)'
})

const ModalContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  width: '60%',
  minWidth: 480,
  margin: '10% auto',
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
