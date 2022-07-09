import styled from '@emotion/styled'
import React from 'react'
import ReactDOM from 'react-dom'
import Colors from './Colors'
import constants from './constants'

function Drawer ({ open, children }) {
  return ReactDOM.createPortal(
    <DrawerContainer open={open}>
      {children}
    </DrawerContainer>,
    document.body
  )
}

const DrawerContainer = styled('div')({
  position: 'fixed',
  zIndex: 1000,
  top: constants.HEADER_HEIGHT + 35,
  bottom: constants.FOOTER_HEIGHT,
  width: 360,
  borderTop: `1px solid ${Colors.backgroundDark}`,
  clipPath: 'inset(0px 0px 0px -10px)',
  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.6)',
  backgroundColor: Colors.backgroundLight,
  transition: 'right 0.2s ease'
}, ({ open }) => ({
  right: open ? 0 : -360
}))

export default Drawer
