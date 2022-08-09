import React from 'react'
import styled from '@emotion/styled'
import { useStorage } from './storage'
import Button from './Button'
import TextInput from './TextInput'
import Loader from './Loader'
import { Route, useRoute } from './RouteProvider'
import Colors from './Colors'
import LinkButton from './LinkButton'
import { useCardSets } from './CardSetProvider'
import CardSetSelect from './CardSetSelect'
import useCardSearch from './useCardSearch'
import constants from './constants'
import ColorSelectArray from './ColorSelectArray'
import ColorSelect from './ColorSelect'
import Icons from './Icon'
import CardDetailsModal from './CardDetailsModal'
import { useCardDrawer } from './CardDrawerProvider'
import CardDrawer from './CardDrawer'
import TableLayoutSelect, { layoutOptions } from './TableLayoutSelect'
import CardCollectionTable from './CardCollectionTable'
import CardSearchTable from './CardSearchTable'
import MenuBar from './MenuBar'
import backToTop from './backToTop'

function SearchContainer () {
  // console.log('----- render -----')
  const order = React.useRef('name')
  const search = React.useRef('')
  const selectedSets = React.useRef([])
  const selectedColors = React.useRef([])

  const [selectedCard, setSelectedCard] = React.useState(null)

  const [tableLayout, setTableLayout] = React.useState(layoutOptions.compact)
  const [drawerOpen, setDrawerOpen] = React.useState(true)
  const [detailsOpen, setDetailsOpen] = React.useState(false)

  const { sets } = useCardSets()
  const { route, setRoute } = useRoute()
  const { cards, meta, fetching, searchCards, next, previous } = useCardSearch()

  const cardDrawer = useCardDrawer()

  // const storage = useStorage()
  // const storageData = storage.getValues()

  function changeRoute (value) {
    setRoute(value)
    backToTop()
  }

  function onSubmit (e) {
    e.preventDefault()
    getCards()
  }

  function getCards () {
    const setRegExp = new RegExp(/set:\w+/gi)
    const setsInSearch = search.current.match(setRegExp) || []

    const colorRegExp = new RegExp(/c:\w+/gi)
    const colorsInSearch = search.current.match(colorRegExp) || []

    const setParams = [...selectedSets.current, ...setsInSearch].join(' OR ')
    const colorParams = [...selectedColors.current, ...colorsInSearch].join(' OR ')

    const searchPhrase = search.current
      .replace(setRegExp, '')
      .replace(colorRegExp, '')
      .trim()

    const completeSearch = [
      (setParams !== '') ? `(${setParams})` : '',
      (colorParams !== '') ? `(${colorParams})` : '',
      `order:${order.current}`,
      searchPhrase
    ].join(' ')

    const options = {
      onSuccess: () => backToTop('table-container')
    }

    // searchCards(completeSearch)
    searchCards(`set:beta order:${order.current}`, options)
    // searchCards(`jedit ojanen order:${order.current}`)
  }

  function sortCards (newOrder) {
    order.current = newOrder
    getCards()
  }

  function toggleDrawer () {
    setDrawerOpen((value) => !value)
  }

  function openCardInfo (card) {
    setSelectedCard(card)
    setDetailsOpen(true)
  }

  function closeCardDrawer () {
    setDrawerOpen(false)
  }

  return (
    <>
      <Header>
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
        <InputBar onSubmit={onSubmit}>
          <CardSetSelect
            sets={sets}
            onChange={(value) => selectedSets.current = value}
          />
          {/* <ColorSelectArray onChange={(value) => selectedColors.current = value} /> */}
          <ColorSelect onChange={(value) => selectedColors.current = value} />
          <Search
            spellCheck={false}
            placeholder={'Search...'}
            onChange={(e) => search.current = e.target.value}
          />
          <GetCardsButton size={'large'} type={'submit'}>Get cards!</GetCardsButton>
        </InputBar>
      </Header>
      <TableContainer id={'table-container'} drawerOpen={drawerOpen}>
        {(route === Route.search) && (
          <CardSearchTable
            cards={cards}
            meta={meta}
            next={next}
            previous={previous}
            tableLayout={tableLayout.value}
            sortCards={sortCards}
            openCardInfo={openCardInfo}
          />
        )}
        {(route === Route.list) && (
          <CardCollectionTable
            tableLayout={tableLayout.value}
            openCardInfo={openCardInfo}
          />
        )}
      </TableContainer>
      <MenuBar>
        <MenuBar.Button disabled={cards.length === 0} onClick={() => backToTop('table-container')}>
          Back to top<Icons.ArrowUp />
        </MenuBar.Button>
        <TableLayoutSelect value={tableLayout} onChange={(value) => setTableLayout(value)} />
        <MenuBar.Button onClick={toggleDrawer}>
          {`Card drawer [${cardDrawer.size()}]`}
        </MenuBar.Button>
        <FooterLoaderContainer>
          {fetching && <Loader />}
        </FooterLoaderContainer>
      </MenuBar>
      <CardDrawer
        open={drawerOpen}
        openCardInfo={openCardInfo}
        onClose={closeCardDrawer}
      />
      <CardDetailsModal
        visible={detailsOpen}
        initialCard={selectedCard}
        card={selectedCard}
        onClose={() => setDetailsOpen(false)}
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

const Header = styled('div')({
  backgroundColor: Colors.backgroundLight
})

const InputBar = styled('form')({
  display: 'flex',
  flex: 1,
  gap: 12,
  padding: 12
})

const Search = styled(TextInput)({
  flex: 1,
  maxWidth: 500
})

const GetCardsButton = styled(Button)({
  lineHeight: '38px'
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

const FooterItem = styled('div')({
  display: 'flex',
  alignItems: 'center'
})

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

const FooterLoaderContainer = styled(FooterItem)({
  width: 22
})

export default SearchContainer
