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
import constants from './constants'
import Drawer from './Drawer'

function SearchContainer () {
  // console.log('----- render -----')
  const [search, setSearch] = React.useState('')
  const [selectedSets, setSelectedSets] = React.useState([])

  const [selectedCard, setSelectedCard] = React.useState(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const { sets } = useCardSets()
  const { setRoute } = useRoute()
  const { cards, meta, fetching, searchCards, next, previous } = useCardSearch()

  // const storage = useStorage()
  // const storageData = storage.getValues()

  function addCard (card) {
    // storage.setValue(card.id, card.name)
  }

  function getCards (e) {
    e.preventDefault()

    const setRegExp = new RegExp(/set:\w+/gi)
    const setsInSearch = search.match(setRegExp) || []
    const searchPhrase = search.replace(setRegExp, '').trim()

    const setParams = [...selectedSets, ...setsInSearch].join(' OR ')
    const completeSearch = `${setParams} ${searchPhrase}`

    // searchCards(completeSearch)
    searchCards('set:alpha')
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
    setDrawerOpen(true)
  }

  function closeCardInfo () {
    // setSelectedCard(null)
    setDrawerOpen(false)
  }

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
      <TableContainer id={'table-container'} drawerOpen={drawerOpen}>
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
              <CardTableRow
                key={card.id}
                card={card}
                sets={sets}
                onNameClick={openCardInfo}
              />
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
          <MenuButton onClick={toggleDrawer}>Drawer</MenuButton>
          <MenuButton onClick={backToTop}>Back to top ⮥</MenuButton>
          <FooterLoaderContainer>
            {fetching && <Loader />}
          </FooterLoaderContainer>
        </Menu>
      </Footer>
      <Drawer open={drawerOpen}>
        {selectedCard && (
          <>
            <LinkButton onClick={closeCardInfo}>Close</LinkButton>
            <div>{selectedCard.name}</div>
            <img src={selectedCard.image_uris.normal} width={'100%'} />
          </>
        )}
      </Drawer>
    </>
  )
}

function CardTableRow ({ card, sets, onNameClick = () => {} }) {
  const [expanded, setExpanded] = React.useState(false)

  function expand () {
    setExpanded((value) => !value)
  }

  function handleNameClick () {
    onNameClick(card)
  }

  return (
    <>
      <tr onClick={expand}>
        <td><CardSet set={sets[card.set]} rarity={card.rarity} /></td>
        <td>{card.collector_number}</td>
        <td><ReservedStatus reserved={card.reserved} /></td>
        {/* <td><CardPreview card={card} /></td> */}
        <td><CardName onClick={handleNameClick}>{card.name}</CardName></td>
        <td><LinkButton.Accept>Add</LinkButton.Accept></td>
      </tr>
      {/* <tr>
        <ExpandedRowContainer colSpan={5}>
          <ExpandedRowWrapper visible={expanded}>
            <CardInfoContainer>asdasd</CardInfoContainer>
          </ExpandedRowWrapper>
        </ExpandedRowContainer>
      </tr> */}
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
      boxShadow: '0px -2px 14px rgba(0, 0, 0, 0.6)',
      clipPath: 'inset(0px 0px 12px 0px)'
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
  position: 'fixed',
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
