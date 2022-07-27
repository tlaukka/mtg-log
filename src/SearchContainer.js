import React from 'react'
import styled from '@emotion/styled'
import { animateScroll } from 'react-scroll'
import { useStorage } from './storage'
import Button from './Button'
import TextInput from './TextInput'
import Loader from './Loader'
import { Route, useRoute } from './RouteProvider'
import Colors from './Colors'
import Tooltip from './Tooltip'
import LinkButton from './LinkButton'
import Popup, { withPopupPosition } from './Popup'
import { useCardSets } from './CardSetProvider'
import CardSetSymbol from './CardSetSymbol'
import CardSetSelect from './CardSetSelect'
import useCardSearch from './useCardSearch'
import constants from './constants'
import ColorSelectArray from './ColorSelectArray'
import Icons from './Icon'
import DataTable from './DataTable'
import CardDetailsModal from './CardDetailsModal'
import { Grade } from './GradeSelect'
import { useCardDrawer } from './CardDrawerProvider'
import CardDrawer from './CardDrawer'

function SearchContainer () {
  // console.log('----- render -----')
  const order = React.useRef('name')
  const search = React.useRef('')
  const selectedSets = React.useRef([])
  const selectedColors = React.useRef([])

  const [selectedCard, setSelectedCard] = React.useState(null)

  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [detailsOpen, setDetailsOpen] = React.useState(true)

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

    const searchPhrase = search.current.replace(setRegExp, '').trim()
    const completeSearch = `(${setParams}) (${colorParams}) ${searchPhrase}`

    // searchCards(completeSearch)
    searchCards(`set:beta order:${order.current}`)
    // searchCards(`jedit ojanen order:${order.current}`)
  }

  function orderCards (newOrder) {
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
          <GetCardsButton type={'submit'}>Get cards!</GetCardsButton>
        </InputBar>
      </Header>
      <TableContainer id={'table-container'} drawerOpen={drawerOpen}>
        <CardTable
          data={cards}
          renderHeader={() => (
            <>
              <DataTable.Header className={'th-set'}>Set</DataTable.Header>
              <TableSortingHeader className={'th-number'} onClick={() => orderCards('set')}>№</TableSortingHeader>
              <DataTable.Header className={'th-reserved'}>Res.</DataTable.Header>
              <DataTable.Header className={'th-image'}></DataTable.Header>
              <TableSortingHeader className={'th-name'} onClick={() => orderCards('name')}>Name</TableSortingHeader>
              <DataTable.Header className={'th-add'}></DataTable.Header>
            </>
          )}
          renderRow={(card) => (
            <>
              <DataTable.Data className={'td-set'}>
                <CardSet set={sets[card.set]} rarity={card.rarity} />
              </DataTable.Data>
              <DataTable.Data className={'td-number'}>{card.collector_number}</DataTable.Data>
              <DataTable.Data className={'td-reserved'}><ReservedStatus reserved={card.reserved} /></DataTable.Data>
              <DataTable.Data className={'td-image'}><CardPreview card={card} /></DataTable.Data>
              <DataTable.Data className={'td-name'}>
                <CardName onClick={() => openCardInfo(card)}>{card.name}</CardName>
              </DataTable.Data>
              <DataTable.Data className={'td-add'}>
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
            </>
          )}
        />
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

function CardSet ({ set, rarity }) {
  return (
    <Tooltip text={`${set.name} - ${new Date(set.released_at).getFullYear()}`}>
      <CardSetContainer rarity={rarity}>
        <CardSetSymbol code={set.code} />
      </CardSetContainer>
    </Tooltip>
  )
}

function ReservedStatus ({ reserved }) {
  return reserved
    ? <Icons.Check style={{ color: Colors.accept }} />
    : <Icons.Cross style={{ color: Colors.error }}  />
}

function CardPreview ({ card }) {
  return (
    <Popup content={<CardPreviewImage src={card.image_uris.small} alt={card.name} set={card.set} />}>
      <CardPreviewButton><Icons.Camera /></CardPreviewButton>
    </Popup>
  )
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

const CardTable = styled(DataTable)({
  th: {
    '&.th-set': {
      width: '1%',
      whiteSpace: 'nowrap',
      paddingLeft: 24
    },
    '&.th-number': {
      textAlign: 'right',
      width: '1%',
      whiteSpace: 'nowrap'
    },
    '&.th-reserved': {
      width: '1%',
      whiteSpace: 'nowrap'
    },
    '&.th-image': {
      width: '1%',
      whiteSpace: 'nowrap'
    },
    '&.th-name': {
      textAlign: 'left'
    },
    '&.th-add': {
      width: '1%',
      whiteSpace: 'nowrap'
    },
    ':last-of-type': {
      paddingRight: 24
    }
  },
  tbody: {
    fontSize: 16,
    'tr:nth-of-type(odd)': {
      backgroundColor: Colors.backgroundAccent
    },
    'tr:first-of-type': {
      height: 12,
    }
  },
  td: {
    '&.td-set': {
      paddingLeft: 24
    },
    '&.td-number': {
      textAlign: 'right',
      color: Colors.control
    },
    '&.td-reserved': {
      textAlign: 'center'
    },
    '&.td-image': {
      padding: 0,
      color: Colors.control
    },
    '&.td-add': {
      textAlign: 'center'
    },
    ':last-of-type': {
      paddingRight: 24
    }
  }
})

const TableSortingHeader = styled(DataTable.Header)({
  cursor: 'pointer',
  ':hover': {
    color: Colors.accept
  }
})

const Footer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  letterSpacing: 0.2,
  position: 'fixed',
  zIndex: 10,
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

const CardName = styled('div')({
  cursor: 'pointer',
  display: 'inline-block',
  ':hover': {
    color: Colors.link
  }
})

const CardPreviewButton = styled(LinkButton)({
  fontSize: 16
})

const CardPreviewImage = withPopupPosition(styled('img')({
  aspectRatio: '488 / 680',
  width: 130
}, ({ set, position }) => {
  const styles = {
    borderRadius: (set === 'lea') ? 10 : 7
  }

  if (position === 'top') {
    return {
      ...styles,
      bottom: 0
    }
  } else {
    return {
      ...styles,
      top: 0
    }
  }
}))

const CardSetContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 20,
  width: 28,
  height: 28,
  borderRadius: '100%',
  color: 'black',
}, ({ rarity = 'common' }) => ({
  backgroundColor: Colors[rarity] || Colors.foregroundLight
}))

export default SearchContainer
