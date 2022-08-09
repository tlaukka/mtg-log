import styled from '@emotion/styled'
import React from 'react'
import ReactDOM from 'react-dom'
import Colors from './Colors'
import constants from './constants'
import LinkButton from './LinkButton'

function MenuBar ({ children }) {
  return (
    <MenuBarContainer>
      <div id={'menu-bar-context'}></div>
      <Menu>
        {children}
      </Menu>
    </MenuBarContainer>
  )
}

function ContextMenu ({ children }) {
  const [domReady, setDomReady] = React.useState(false)

  React.useEffect(
    () => {
      setDomReady(true)
    },
    []
  )

  if (!domReady) {
    return null
  }

  return ReactDOM.createPortal(
    <Menu>
      {children}
    </Menu>,
    document.getElementById('menu-bar-context')
  )
}

const MenuBarContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  letterSpacing: 0.2,
  position: 'fixed',
  zIndex: 1001,
  left: 0,
  right: 0,
  bottom: 0,
  height: constants.FOOTER_HEIGHT,
  fontSize: 12,
  padding: '0 12px',
  color: Colors.control,
  backgroundColor: Colors.backgroundDark
})

const Menu = styled('div')({
  display: 'flex',
  gap: 12,
  height: '100%'
})

const MenuItem = styled('div')({
  display: 'flex',
  alignItems: 'center'
})

const MenuButton = styled(LinkButton)({
  fontSize: 12,
  lineHeight: `${constants.FOOTER_HEIGHT}px`,
  padding: '0 6px'
})

MenuBar.ContextMenu = ContextMenu
MenuBar.Item = MenuItem
MenuBar.Button = MenuButton

export default MenuBar
