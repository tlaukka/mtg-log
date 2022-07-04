import React from 'react'
import styled from '@emotion/styled'
import { useStorage } from './storage'
import Button from './Button'
import TextInput from './TextInput'
import qs from 'qs'
import { Route, useRoute } from './RouteProvider'
import Colors from './Colors'
import Tooltip from './Tooltip'
import LinkButton from './LinkButton'
import Popup from './Popup'
import Select from './Select'
// import ReactSelect, { components, createFilter } from 'react-select'

function SearchContainer ({ sets = {} }) {
  const [search, setSearch] = React.useState('')
  const [cards, setCards] = React.useState([])

  const { setRoute } = useRoute()

  // const storage = useStorage()
  // const storageData = storage.getValues()

  const fetchCards = React.useCallback(
    async (search) => {
      const params = {
        q: 'set:leg jedit'
        // q: 'lotus'
        // q: search
      }

      const query = `https://api.scryfall.com/cards/search?${qs.stringify(params)}`
      const response = await fetch(query)

      const json = await response.json()
      console.log(json)

      if (response.status === 200) {
        setCards(json.data)
      }
    },
    []
  )

  function addCard (card) {
    // storage.setValue(card.id, card.name)
  }

  return (
    <>
      <LinkButton onClick={() => setRoute(Route.list)}>← Back to cards</LinkButton>
      <InputBar>
        {/* <Select
          placeholder={'Set'}
        >
          <Select.Option key={'all'}>All</Select.Option>
          {Object.values(sets).map((set) => (
            <Select.Option key={set.id}>{set.name}</Select.Option>
          ))}
        </Select> */}
        <CardSetSelect sets={sets} />
        <TextInput
          spellCheck={false}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => fetchCards(search)}>
          Get cards!
        </Button>
      </InputBar>
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
    </>
  )
}

function CardSet ({ set, rarity }) {
  return (
    <Tooltip text={`${set.name} - ${new Date(set.released_at).getFullYear()}`}>
      <CardSetContainer rarity={rarity}>
        <CardSetIcon src={set.icon_svg_uri} alt={set.code} />
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

function Rarity ({ rarity }) {
  return (
    <Tooltip text={rarity}>
      <RaritySymbol rarity={rarity} />
    </Tooltip>
  )
}

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

const RaritySymbol = styled('div')(({ rarity }) => ({
  width: 12,
  height: 12,
  borderRadius: '100%',
  backgroundColor: Colors[rarity] || Colors.backgroundDark
}))

const InputBar = styled('div')({
  display: 'flex',
  flex: 1,
  gap: 12,
  marginBottom: 12,
  border: '1px solid black'
})

function CardSetSelect ({ sets }) {
  const [selectedValue, setSelectedValue] = React.useState(null)

  const options = React.useMemo(
    () => {
      return Object.values(sets).map((set) => {
        return {
          value: `set:${set.code}`,
          label: set.name
        }
      })
    },
    [sets]
  )

  return (
    <Select
      isMulti
      options={options}
      value={selectedValue}
      placeholder={'Card set...'}
      onChange={setSelectedValue}
    />
  )
}

const CardTable = styled('table')({

})

const CardSetContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 28,
  height: 28,
  borderRadius: '100%',
}, ({ rarity = 'common' }) => ({
  backgroundColor: Colors[rarity] || Colors.foregroundLight
}))

const CardSetIcon = styled('img')({
  width: 20,
  height: 20
})

export default SearchContainer
