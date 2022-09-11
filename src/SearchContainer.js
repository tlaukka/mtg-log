import React from 'react'
import styled from '@emotion/styled'
import { Route, useRoute } from './RouteProvider'
import Colors from './Colors'
import LinkButton from './LinkButton'
import constants from './constants'
import Icons from './Icon'
import { useCardDrawer } from './CardDrawerProvider'
import CardDrawer from './CardDrawer'
import TableLayoutSelect, { layoutOptions } from './TableLayoutSelect'
import CardCollectionTable from './CardCollectionTable'
import CardSearchTable from './CardSearchTable'
import MenuBar from './MenuBar'
import backToTop from './backToTop'
import SearchBar from './SearchBar'

function SearchContainer () {
  const [tableLayout, setTableLayout] = React.useState(layoutOptions.compact)
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const { route, setRoute } = useRoute()
  const cardDrawer = useCardDrawer()

  function changeRoute (value) {
    setRoute(value)
    backToTop('table-container')
  }

  function toggleDrawer () {
    setDrawerOpen((value) => !value)
  }

  function closeCardDrawer () {
    setDrawerOpen(false)
  }

  return (
    <>
      <NavBar>
        <NavBarTabContainer>
          <NavMenuItem disabled={route === Route.search} onClick={() => changeRoute(Route.search)}>
            <Icons.Search />Card search
          </NavMenuItem>
          <NavMenuItem disabled={route === Route.list} onClick={() => changeRoute(Route.list)}>
            <Icons.Case />Card collection
          </NavMenuItem>
        </NavBarTabContainer>
      </NavBar>
      <SearchBar />
      <TableContainer id={'table-container'} drawerOpen={drawerOpen}>
        {(route === Route.search) && (
          <CardSearchTable tableLayout={tableLayout.value} />
        )}
        {(route === Route.list) && (
          <CardCollectionTable tableLayout={tableLayout.value} />
        )}
      </TableContainer>
      <MenuBar>
        {/* <MenuBar.Button disabled={cards.length === 0} onClick={() => backToTop('table-container')}>
          Back to top<Icons.ArrowUp />
        </MenuBar.Button> */}
        <TableLayoutSelect value={tableLayout} onChange={(value) => setTableLayout(value)} />
        <MenuBar.Button onClick={toggleDrawer}>
          {`Card drawer [${cardDrawer.size()}]`}
        </MenuBar.Button>
      </MenuBar>
      <CardDrawer
        open={drawerOpen}
        onClose={closeCardDrawer}
      />
      <div
        style={{ position: 'fixed', zIndex: 100000, top: 0, right: 0 }}
        onClick={() => console.log({ w: window.innerWidth, h: window.innerHeight })}
      >
        Size
      </div>
    </>
  )
}

const media = {
  screen: {
    sm: '@media only screen and (max-width: 1024px)',
    md: '@media only screen and (max-width: 1624px)'
  }
}

const NavBar = styled('div')({
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'stretch',
  backgroundColor: Colors.backgroundDark
})

const NavBarTabContainer = styled('div')({
  display: 'flex',
  flex: 1,
  gap: 12,
  overflow: 'hidden'
})

const TableContainer = styled('div')({
  overflow: 'auto',
  height: `calc(100vh - ${constants.HEADER_HEIGHT}px - ${constants.FOOTER_HEIGHT}px)`,
  transition: 'margin-right 0.2s ease',
  '&::-webkit-scrollbar-track': {
    marginTop: 35
  }
}, ({ drawerOpen }) => ({
  marginRight: drawerOpen ? constants.DRAWER_WIDTH : 0
}))


const MenuButton = styled(LinkButton)({
  fontSize: 20,
  lineHeight: '48px',
  height: 48,
  padding: '0 6px'
})

const NavMenuItem = styled(MenuButton)({
  flex: 1,
  position: 'relative',
  padding: '0 12px',
  color: '#6B7986',
  ':before': {
    content: '""',
    position: 'absolute',
    left: -10,
    zIndex: -1,
    width: 32,
    height: '100%',
    transform: 'skewX(-15deg)',
    backgroundColor: 'inherit'
  },
  ':after': {
    content: '""',
    position: 'absolute',
    right: -10,
    zIndex: -1,
    width: 32,
    height: '100%',
    transform: 'skewX(15deg)',
    backgroundColor: 'inherit'
  },
  i: {
    marginRight: 2
  },
  ':disabled': {
    zIndex: 2,
    color: Colors.control,
    backgroundColor: Colors.backgroundLight,
  },
  ':not(:disabled)': {
    zIndex: 1,
    ':hover': {
      color: Colors.control
    }
  }
})

export default SearchContainer
