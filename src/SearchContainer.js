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
  const [drawerOpen, setDrawerOpen] = React.useState(true)

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
        {/* <FooterLoaderContainer>
          {fetching && <Loader />}
        </FooterLoaderContainer> */}
      </MenuBar>
      <CardDrawer
        open={drawerOpen}
        onClose={closeCardDrawer}
      />
    </>
  )
}

const NavBar = styled('div')({
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'stretch',
  padding: '0 12px',
  backgroundColor: Colors.backgroundDark
})

const NavBarTabContainer = styled('div')({
  display: 'flex'
})

const TableContainer = styled('div')({
  overflow: 'auto',
  height: `calc(100vh - ${constants.HEADER_HEIGHT}px - ${constants.FOOTER_HEIGHT}px)`,
  transition: 'margin-right 0.2s ease',
  '&::-webkit-scrollbar-track': {
    marginTop: 35
  }
}, ({ drawerOpen }) => ({
  marginRight: drawerOpen ? 360 : 0
}))


const MenuButton = styled(LinkButton)({
  fontSize: 12,
  lineHeight: `${constants.FOOTER_HEIGHT}px`,
  padding: '0 6px'
})

const NavMenuItem = styled(MenuButton)({
  position: 'relative',
  padding: '0 12px',
  color: '#6B7986',
  i: {
    marginRight: 2
  },
  ':disabled': {
    color: Colors.control,
    backgroundColor: Colors.backgroundLight
  },
  ':not(:disabled)': {
    ':hover': {
      color: Colors.control
    }
  }
})

// const FooterLoaderContainer = styled('div')({
//   display: 'flex',
//   alignItems: 'center'
//   width: 22
// })

export default SearchContainer
