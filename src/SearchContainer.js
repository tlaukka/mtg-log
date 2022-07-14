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
import Popup from './Popup'
import { useCardSets } from './CardSetProvider'
import CardSetSymbol from './CardSetSymbol'
import CardSetSelect from './CardSetSelect'
import useCardSearch from './useCardSearch'
import useCardCollection from './useCardCollection'
import constants from './constants'
import Drawer from './Drawer'
import ColorSelect from './ColorSelect'

function SearchContainer () {
  // console.log('----- render -----')
  const [search, setSearch] = React.useState('')
  const [selectedSets, setSelectedSets] = React.useState([])
  const [selectedColors, setSelectedColors] = React.useState([])
  const [selectedCard, setSelectedCard] = React.useState(null)

  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [detailsOpen, setDetailsOpen] = React.useState(true)

  const { sets } = useCardSets()
  const { setRoute } = useRoute()
  const { cards, meta, fetching, searchCards, next, previous } = useCardSearch()

  const cardCollection = useCardCollection()

  // const storage = useStorage()
  // const storageData = storage.getValues()

  function getCards (e) {
    e.preventDefault()

    const setRegExp = new RegExp(/set:\w+/gi)
    const setsInSearch = search.match(setRegExp) || []
    const searchPhrase = search.replace(setRegExp, '').trim()

    const setParams = [...selectedSets, ...setsInSearch].join(' OR ')
    const completeSearch = `${setParams} ${searchPhrase}`

    // searchCards(completeSearch)
    searchCards('set:alpha')
    // searchCards('set:leg')
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
    // setDrawerOpen(true)
    setDetailsOpen(true)
  }

  function closeCardInfo () {
    // setSelectedCard(null)
    setDrawerOpen(false)
  }
console.log(cards.length)
  return (
    <>
      <Header>
        <NavBar>
          <Menu>
            <MenuButton onClick={() => setRoute(Route.list)}>🞀 Back to cards</MenuButton>
          </Menu>
        </NavBar>
        <InputBar onSubmit={getCards}>
          <CardSetSelect
            sets={sets}
            onChange={setSelectedColors}
          />
          <ColorSelect
            sets={sets}
            onChange={setSelectedSets}
          />
          <Search
            value={search}
            placeholder={'Search...'}
            spellCheck={false}
            onChange={(e) => setSearch(e.target.value)}
          />
          <GetCardsButton type={'submit'}>Get cards!</GetCardsButton>
        </InputBar>
      </Header>
      <TableContainer id={'table-container'} drawerOpen={drawerOpen} detailsOpen={detailsOpen}>
        <CardTable>
          <thead>
            <tr>
              <th>Set</th>
              <th>№</th>
              <th>Res.</th>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr className={'spacer'} />
            {cards.map((card) => (
              <tr key={card.id}>
                <td><CardSet set={sets[card.set]} rarity={card.rarity} /></td>
                <td>{card.collector_number}</td>
                <td><ReservedStatus reserved={card.reserved} /></td>
                {/* <td><CardPreview card={card} /></td> */}
                <td><CardName onClick={() => openCardInfo(card)}>{card.name}</CardName></td>
                <td>
                  {cardCollection.has(card) ? (
                    <LinkButton.Decline onClick={() => cardCollection.remove(card)}>
                      &#10539;
                    </LinkButton.Decline>
                  ) : (
                    <LinkButton.Accept onClick={() => cardCollection.add(card)}>
                      🞣
                    </LinkButton.Accept>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </CardTable>
      </TableContainer>
      <Footer>
        <Menu>
          {(cards.length > 0) && (
            <>
              {meta.totalCards && <FooterItem>{`Total cards: ${meta.totalCards}`}</FooterItem>}
              {meta.page && <FooterItem>{`${meta.page} / ${meta.totalPages}`}</FooterItem>}
              <MenuButton disabled={!previous} onClick={() => onPageChange(previous)}>
                🞀 Previous
              </MenuButton>
              <MenuButton disabled={!next} onClick={() => onPageChange(next)}>
                Next 🞂
              </MenuButton>
            </>
          )}
        </Menu>
        <Menu>
          <MenuButton disabled={cards.length === 0} onClick={backToTop}>
            Back to top ⮥
          </MenuButton>
          <MenuButton onClick={toggleDrawer}>
            {`Card drawer [${cardCollection.size()}]`}
          </MenuButton>
          <FooterLoaderContainer>
            {fetching && <Loader />}
          </FooterLoaderContainer>
        </Menu>
      </Footer>
      <CardDetails
        open={detailsOpen}
        drawerOpen={drawerOpen}
        card={selectedCard}
        onClose={() => setDetailsOpen(false)}
      />
      <Drawer open={drawerOpen}>
        <Menu>
          <CloseButton onClick={closeCardInfo} />
        </Menu>
        <CardDrawerContainer>
          {cardCollection.toArray().map((card) => (
            <CardDrawerRow key={card.id}>
              <CardDrawerRemove onClick={() => cardCollection.remove(card)} />
              <CardDrawerCardName>{card.name}</CardDrawerCardName>
            </CardDrawerRow>
          ))}
        </CardDrawerContainer>
        <CardDrawerFooter>
          <SaveButton>Save!</SaveButton>
        </CardDrawerFooter>
      </Drawer>
    </>
  )
}

function ExpandableTableRow ({ content, children }) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <>
      <tr onClick={() => setExpanded((value) => !value)}>
        {children}
      </tr>
      <tr>
        <ExpandedRowContainer colSpan={5}>
          <ExpandedRowWrapper visible={expanded}>
            {content}
          </ExpandedRowWrapper>
        </ExpandedRowContainer>
      </tr>
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

function CardPreview ({ card }) {
  return (
    <Popup content={<CardPreviewImage src={card.image_uris.small} />}>
      <CardName>{card.name}</CardName>
    </Popup>
  )
}

function CardDetails ({ open, drawerOpen, card, onClose }) {
  return (
    <CardDetailsContainer open={open} drawerOpen={drawerOpen}>
      {card && (
        <>
          <DetailsImage src={card.image_uris.normal} alt={card.name} setCode={card.set} />
          <DetailsClose onClick={onClose} />
        </>
      )}
    </CardDetailsContainer>
  )
}

const CardDrawerContainer = styled('div')({
  fontSize: 14,
  lineHeight: '20px',
  overflow: 'auto',
  height: 'calc(100% - 120px)',
  margin: '0 12px',
  padding: 12,
  borderRadius: 3,
  backgroundColor: Colors.backgroundDark,
  '::-webkit-scrollbar-track': {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3
  }
})

const CardDrawerFooter = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 64
})

const CardDrawerRow = styled('div')({
  display: 'flex',
  minWidth: 0
})

const CardDrawerCardName = styled('div')({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const CardDrawerRemove = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  flex: '0 0 20px',
  marginRight: 8,
  color: Colors.decline,
  ':hover': {
    color: Colors.declineLight
  },
  ':after': {
    content: '"\\292b"'
  }
})

const SaveButton = styled(Button)({
  width: 160
})

const CloseButton = styled(LinkButton.Decline)({
  ':after': {
    content: '"Close \\292b"'
  }
})

const CardDetailsContainer = styled('div')({
  boxSizing: 'border-box',
  position: 'fixed',
  zIndex: 5,
  top: `${constants.HEADER_HEIGHT + 59}px`,
  width: 300,
  transition: 'all 0.2s ease',
  backgroundColor: 'transparent'
}, ({ open, drawerOpen }) => ({
  opacity: open ? 1 : 0,
  visibility: open ? 'visible' : 'hidden',
  right: drawerOpen ? 384 : 24
}))

const DetailsImage = styled('img')({
  width: '100%',
  boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.5)'
}, ({ setCode }) => ({
  borderRadius: (setCode === 'lea') ? 24 : 15
}))

const DetailsClose = styled(CloseButton)({
  display: 'block',
  fontSize: 12,
  lineHeight: '24px',
  width: 44,
  margin: '0 auto',
  padding: 0
})

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
  transition: 'max-height 0.2s ease, margin-right 0.2s ease',
  // transition: 'margin-right 0.2s ease',
  '&::-webkit-scrollbar-track': {
    marginTop: 35
  }
}, ({ drawerOpen, detailsOpen }) => ({
  marginRight: drawerOpen ? 360 : 0,
  // maxHeight: detailsOpen ? `calc(100vh - ${constants.HEADER_HEIGHT}px - ${constants.FOOTER_HEIGHT}px - 200px)` : `calc(100vh - ${constants.HEADER_HEIGHT}px - ${constants.FOOTER_HEIGHT}px)`
}))

const CardTable = styled('table')({
  borderCollapse: 'collapse',
  width: '100%',
  marginBottom: 24,
  backgroundColor: Colors.backgroundLight,
  thead: {
    fontSize: 16,
    color: Colors.control,
    tr: {
      position: 'sticky',
      zIndex: 2,
      top: 0,
      overflow: 'hidden',
      boxShadow: '0px -2px 14px rgba(0, 0, 0, 0.6)'
      // clipPath: 'inset(0px 0px 12px 0px)'
    }
  },
  th: {
    padding: '8px 12px',
    backgroundColor: Colors.backgroundLight,
    ':nth-of-type(1)': { // Set
      width: 29,
      paddingLeft: 24
    },
    ':nth-of-type(2)': { // Number
      textAlign: 'right',
      width: 29
    },
    ':nth-of-type(3)': { // Reserved
      width: 32
    },
    ':nth-of-type(4)': { // Name
      textAlign: 'left'
    },
    ':nth-of-type(5)': { // Add
      width: 48
    },
    ':last-of-type': {
      paddingRight: 24
    }
  },
  tbody: {
    fontSize: 16,
    // tr: {
    //   borderBottom: `1px solid ${Colors.backgroundDark}`,
    // },
    'tr:nth-of-type(odd)': {
      backgroundColor: Colors.backgroundAccent
    },
    // 'tr:nth-of-type(4n)': {
    //   backgroundColor: Colors.backgroundAccent
    // },
    'tr:first-of-type': {
      height: 12
    },
    // 'tr:hover': {
    //   backgroundColor:  Colors.backgroundAccent
    // }
  },
  td: {
    // padding: '12px 12px 6px',
    padding: '8px 12px',
    '&:nth-of-type(1)': { // Set
      paddingLeft: 24
    },
    '&:nth-of-type(2)': { // Number
      textAlign: 'right',
      color: Colors.control
    },
    '&:nth-of-type(3)': { // Reserved
      textAlign: 'center'
    },
    '&:nth-of-type(5)': { // Add
      textAlign: 'center'
    },
    '&:last-of-type': {
      paddingRight: 24
    }
  }
})

const ExpandedRowContainer = styled('td')({
  padding: '0px !important'
})

const ExpandedRowWrapper = styled('div')({
  overflow: 'hidden',
  transition: 'max-height 0.2s ease'
}, ({ visible }) => ({
  maxHeight: visible ? 43 : 0
}))

const CardInfoContainer = styled('div')({
  padding: 12,
  backgroundColor: Colors.backgroundAccent
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

const CardPreviewImage = styled('img')({
  borderRadius: 7
})

const ReservedStatus = styled('div')(({ reserved }) => ({
  ':before': {
    content: `"${reserved ? '✓' : '✗'}"`,
    color: reserved ? Colors.success : Colors.error
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
