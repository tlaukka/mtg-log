import React from 'react'
import styled from '@emotion/styled'
import Scroll, { animateScroll } from 'react-scroll'
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


function SearchContainer () {
  // console.log('----- render -----')
  const table = React.useRef()

  const [search, setSearch] = React.useState('')
  const [selectedSets, setSelectedSets] = React.useState([])

  const { sets } = useCardSets()
  const { setRoute } = useRoute()
  const { cards, meta, fetching, searchCards, next, previous } = useCardSearch()
  console.log(cards.length)
  // console.log({
  //   next,
  //   previous
  // })

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

  return (
    <>
      <Header>
        <NavBar>
          <LinkButton onClick={() => setRoute(Route.list)}>← Back to cards</LinkButton>
        </NavBar>
        <InputBar onSubmit={getCards}>
          <CardSetSelect
            sets={sets}
            onChange={setSelectedSets}
          />
          <TextInput
            value={search}
            placeholder={'Search...'}
            spellCheck={false}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type={'submit'}>Get cards!</Button>
        </InputBar>
      </Header>
      <TableContainer id={'table-container'} ref={table}>
        <CardTable>
          <thead>
            <tr>
              <th>Set</th>
              <th>#</th>
              <th>Name</th>
              <th>Reserved</th>
            </tr>
          </thead>
          <tbody>
            <tr className={'spacer'} />
            {cards.map((card) => (
              <tr key={card.id} onClick={() => addCard(card)}>
                <td><CardSet set={sets[card.set]} rarity={card.rarity} /></td>
                <td>{card.collector_number}</td>
                <td><CardPreview card={card} /></td>
                <td><ReservedStatus reserved={card.reserved} /></td>
              </tr>
            ))}
          </tbody>
        </CardTable>
      </TableContainer>
      <Footer>
        <FooterMenu>
          {meta.totalCards && <FooterItem>{`Total cards: ${meta.totalCards}`}</FooterItem>}
          {meta.page && <FooterItem>{`${meta.page} / ${meta.totalPages}`}</FooterItem>}
          {cards && (
            <>
              <FooterButton disabled={!previous} onClick={() => onPageChange(previous)}>
                &lsaquo; Previous
              </FooterButton>
              <FooterButton disabled={!next} onClick={() => onPageChange(next)}>
                Next &rsaquo;
              </FooterButton>
            </>
          )}
        </FooterMenu>
        <FooterMenu>
          <FooterButton onClick={backToTop}>Back to top ↑</FooterButton>
          <FooterLoaderContainer>
            {fetching && <Loader />}
          </FooterLoaderContainer>
        </FooterMenu>
      </Footer>
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
  margin: 12
})

const Header = styled('div')({
  backgroundColor: Colors.backgroundLight
})

const InputBar = styled('form')({
  display: 'flex',
  flex: 1,
  gap: 12,
  margin: 12
  // ':nth-child(1)': {
  //   flex: 1
  // },
  // ':nth-child(2)': {
  //   flex: 1
  // }
})

const TableContainer = styled('div')({
  overflow: 'auto',
  height: 'calc(100vh - 129px)'
})

const CardTable = styled('table')({
  borderCollapse: 'collapse',
  width: '100%',
  marginBottom: 24,
  backgroundColor: Colors.backgroundLight,
  thead: {
    fontSize: 16,
    color: Colors.control,
    tr: {
      boxShadow: '0 -2px 14px rgba(0, 0, 0, 0.6)',
      position: 'sticky',
      zIndex: 2,
      top: 0,
    }
  },
  th: {
    padding: '8px 12px',
    backgroundColor: Colors.backgroundLight,
    ':nth-child(1)': { // Set
      width: 29,
      paddingLeft: 24
    },
    ':nth-child(2)': { // Number
      textAlign: 'right',
      width: 29
    },
    ':nth-child(3)': { // Name
      textAlign: 'left'
    },
    ':nth-child(4)': { // Reserved
      width: 100
    },
    ':last-child': {
      paddingRight: 24
    }
  },
  tbody: {
    fontSize: 16,
    // tr: {
    //   borderBottom: `1px solid ${Colors.backgroundDark}`
    // },
    'tr:nth-child(odd)': {
      backgroundColor: '#303541'
    },
    'tr:first-child': {
      height: 12
    },
    // 'tr:hover': {
    //   backgroundColor: '#303541'
    // }
  },
  td: {
    // padding: '4px 12px',
    padding: '12px 12px 6px',
    ':nth-child(1)': { // Set
      paddingLeft: 24
    },
    ':nth-child(2)': { // Number
      textAlign: 'right',
      color: Colors.control
    },
    ':nth-child(4)': { // Reserved
      textAlign: 'center'
    },
    ':last-child': {
      paddingRight: 24
    }
  }
})

const Footer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  fontSize: 12,
  padding: '0 12px',
  color: Colors.control,
  backgroundColor: Colors.backgroundDark
})

const FooterMenu = styled('div')({
  display: 'flex',
  gap: 12
})

const FooterItem = styled('div')({
  display: 'flex',
  alignItems: 'center'
})

const FooterButton = styled(LinkButton)({
  padding: '0 6px'
})

const FooterLoaderContainer = styled(FooterItem)({
  width: 22
})

const CardName = styled('div')({
  cursor: 'pointer',
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
