import React from 'react'
import styled from '@emotion/styled'
import { animateScroll } from 'react-scroll'
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
import Icons from './Icon'
import CardDetailsModal from './CardDetailsModal'
import { useCardDrawer } from './CardDrawerProvider'
import CardDrawer from './CardDrawer'
import CardTable from './CardTable'
import TableLayoutSelect, { layoutOptions } from './TableLayoutSelect'
import { Grade } from './GradeSelect'
import DataTable from './DataTable'

function SearchContainer () {
  // console.log('----- render -----')
  const order = React.useRef('name')
  const search = React.useRef('')
  const selectedSets = React.useRef([])
  const selectedColors = React.useRef([])

  const [selectedCard, setSelectedCard] = React.useState(null)

  const [tableLayout, setTableLayout] = React.useState(layoutOptions.compact)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [detailsOpen, setDetailsOpen] = React.useState(false)

  const { sets } = useCardSets()
  const { setRoute } = useRoute()
  const { cards, meta, fetching, searchCards, next, previous } = useCardSearch()

  const cardDrawer = useCardDrawer()

  // const storage = useStorage()
  // const storageData = storage.getValues()

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

    // searchCards(completeSearch)
    searchCards(`set:beta order:${order.current}`)
    // searchCards(`jedit ojanen order:${order.current}`)
  }

  function sortCards (newOrder) {
    order.current = newOrder
    getCards()
  }

  function onPageChange (fn) {
    fn()
    backToTop(100)
  }

  function backToTop (delay = 0) {
    animateScroll.scrollToTop({
      containerId: 'table-container',
      duration: 200,
      delay
    })
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

  function renderCardTable () {
    const Table = CardTableComponent[tableLayout.value]

    return (
      <Table
        cards={cards}
        sortCards={sortCards}
        openCardInfo={openCardInfo}
      />
    )
  }

  return (
    <>
      <Header>
        <NavBar>
          <Menu>
            <MenuButton onClick={() => setRoute(Route.list)}>
              <Icons.ArrowLeft />Back to cards
            </MenuButton>
          </Menu>
        </NavBar>
        <InputBar onSubmit={onSubmit}>
          <CardSetSelect
            sets={sets}
            onChange={(value) => selectedSets.current = value}
          />
          <ColorSelectArray onChange={(value) => selectedColors.current = value} />
          {/* <ColorSelect onChange={(value) => selectedColors.current = value} /> */}
          <Search
            spellCheck={false}
            placeholder={'Search...'}
            onChange={(e) => search.current = e.target.value}
          />
          <GetCardsButton size={'large'} type={'submit'}>Get cards!</GetCardsButton>
        </InputBar>
      </Header>
      <TableContainer id={'table-container'} drawerOpen={drawerOpen}>
        {renderCardTable()}
      </TableContainer>
      <Footer>
        <Menu>
          {(cards.length > 0) && (
            <>
              {meta.totalCards && <FooterItem>{`Total cards: ${meta.totalCards}`}</FooterItem>}
              {meta.page && <FooterItem>{`${meta.page} / ${meta.totalPages}`}</FooterItem>}
              <MenuButton disabled={!previous} onClick={() => onPageChange(previous)}>
                <Icons.ChevronLeft />Previous
              </MenuButton>
              <MenuButton disabled={!next} onClick={() => onPageChange(next)}>
                Next<Icons.ChevronRight />
              </MenuButton>
            </>
          )}
        </Menu>
        <Menu>
          <MenuButton disabled={cards.length === 0} onClick={backToTop}>
            Back to top<Icons.ArrowUp />
          </MenuButton>
          <TableLayoutSelect value={tableLayout} onChange={(value) => setTableLayout(value)} />
          <MenuButton onClick={toggleDrawer}>
            {`Card drawer [${cardDrawer.size()}]`}
          </MenuButton>
          <FooterLoaderContainer>
            {fetching && <Loader />}
          </FooterLoaderContainer>
        </Menu>
      </Footer>
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

function CardTableCompact (props) {
  const cardDrawer = useCardDrawer()

  return (
    <CardTable.Compact
      {...props}
      renderHeader={() => (
        <DataTable.Header fitToContent></DataTable.Header>
      )}
      renderRow={({ card }) => (
        <DataTable.Data textAlign={'center'}>
          {cardDrawer.has(card) ? (
            <LinkButton.Danger onClick={() => cardDrawer.remove(card)}>
              <Icons.Cross />
            </LinkButton.Danger>
          ) : (
            <LinkButton.Accept onClick={() => cardDrawer.add(card, { grade: Grade.nm })}>
              <Icons.Plus />
            </LinkButton.Accept>
          )}
        </DataTable.Data>
      )}
    />
  )
}

function CardTableFull (props) {
  const cardDrawer = useCardDrawer()

  return (
    <CardTable.Full
      {...props}
      renderMenu={({ card }) => (
        cardDrawer.has(card) ? (
          <Button.Danger size={'small'} onClick={() => cardDrawer.remove(card)}>Remove</Button.Danger>
        ) : (
          <Button.Accept size={'small'} onClick={() => cardDrawer.add(card, { grade: Grade.nm })}>Add</Button.Accept>
        )
      )}
    />
  )
}

const CardTableComponent = {
  compact: CardTableCompact,
  details: CardTableFull
}

const NavBar = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  padding: '0 12px',
  borderBottom: `1px solid ${Colors.backgroundDark}`
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

const Footer = styled('div')({
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
  gap: 12
})

const FooterItem = styled('div')({
  display: 'flex',
  alignItems: 'center'
})

const MenuButton = styled(LinkButton)({
  fontSize: 12,
  lineHeight: `${constants.FOOTER_HEIGHT}px`,
  padding: '0 6px'
})

const FooterLoaderContainer = styled(FooterItem)({
  width: 22
})

export default SearchContainer
