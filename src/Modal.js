import styled from '@emotion/styled'
import React from 'react'
import ReactDOM from 'react-dom'
import Colors from './Colors'
import Icons from './Icon'
import LinkButton from './LinkButton'

function Modal ({ visible, onClose, children }) {
  if (!visible) {
    return false
  }

  return ReactDOM.createPortal(
    <Backdrop onClick={onClose}>
      <ModalClose onClick={onClose}><Icons.Cross /></ModalClose>
      <ModalContainer>
        {children}
      </ModalContainer>
    </Backdrop>,
    document.body
  )
}

const Backdrop = styled('div')({
  position: 'fixed',
  zIndex: 1000,
  top: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(2px)'
})

const ModalContainer = styled('div')({
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
