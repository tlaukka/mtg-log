import React from 'react'
import styled from '@emotion/styled'
import CardTable from './CardTable'
import { useCardStorage } from './CardStorageProvider'
import DataTable from './DataTable'
import { layoutOptions } from './TableLayoutSelect'
import GradeSelect, { gradeOptions } from './GradeSelect'
import PriceInput from './PriceInput'
import { CardDetailsDataTable } from './CardDetailsTable'
import Colors from './Colors'
import MenuBar from './MenuBar'
import CardCollectionDetailsModal from './CardCollectionDetailsModal'
import { useCardModalControls } from './CardModal'
import Pagination from './Pagination'
import usePagination from './usePagination'
import GradeTag from './GradeTag'
import backToTop from './backToTop'
import SearchBar from './SearchBar'
import Button from './Button'
import CardSetSelect from './CardSetSelect'
import ColorSelect from './ColorSelect'
import TextInput from './TextInput'
import SearchInput from './SearchInput'
import CardFilterBar from './CardFilterBar'

const COLORS = {
  'c:black': 'B',
  'c:green': 'G',
  'c:red': 'R',
  'c:blue': 'U',
  'c:white': 'W',
  'c:multicolor': 'M',
  'c:colorless': 'C',
}

const CardFilter = {}

CardFilter.set = (sets, card) => {
  if (sets.length === 0) {
    return true
  }

  return sets.includes(`set:${card.set}`)
}

CardFilter.search = (search, card) => {
  if (search === '') {
    return true
  }

  const searchRegExp = new RegExp(`${search}`, 'i')
  return card.name.match(searchRegExp)
}

CardFilter.color = (colors, card) => {
  if (colors.length === 0) {
    return true
  }

  if (colors.includes('M') && card.colors.length > 1) {
    return true
  }

  if (colors.includes('C') && card.colors.length === 0) {
    return true
  }

  return colors.some((entry) => {
    return card.colors.includes(entry)
  })
}

CardFilter.type = (types, card) => {
  if (types.length === 0) {
    return true
  }

  return types.some((entry) => {
    return card.type_line.toLowerCase().includes(entry.slice(2))
  })
}

CardFilter.rarity = (rarities, card) => {
  if (rarities.length === 0) {
    return true
  }

  return rarities.some((entry) => {
    return card.rarity === entry.slice(2)
  })
}

CardFilter.status = (statuses, card) => {
  if (statuses.length === 0) {
    return true
  }

  return statuses.some((entry) => {
    if (entry === 'is:reserved') {
      return card.reserved
    }

    return true
  })
}

function useCardFilter (collection, filter) {
  if (
    (filter.sets.length === 0) &&
    (filter.search === '') &&
    (filter.colors.length === 0) &&
    (filter.types.length === 0) &&
    (filter.rarities.length === 0) &&
    (filter.statuses.length === 0)
  ) {
    return collection.toArray()
  }

  const colors = filter.colors.map((c) => COLORS[c])

  return collection.toArray().filter(({ card }) => {
    if (
      CardFilter.set(filter.sets, card) &&
      CardFilter.search(filter.search, card) &&
      CardFilter.color(colors, card) &&
      CardFilter.type(filter.types, card) &&
      CardFilter.rarity(filter.rarities, card) &&
      CardFilter.status(filter.statuses, card)
    ) {
      return true
    }

    return false
  })
}

function useCardSorting (collection, sort) {
  if (sort.field === 'set') {
    return [...collection].sort((a, b) => {
      if (sort.order === 'asc') {
        return a.card.collector_number - b.card.collector_number
      }

      return b.card.collector_number - a.card.collector_number
    })
  }

  if (sort.field === 'name') {
    return [...collection].sort((a, b) => {
      if (sort.order === 'asc') {
        return a.card.name.localeCompare(b.card.name)
      }

      return b.card.name.localeCompare(a.card.name)
    })
  }

  return collection
}

const initialState = {
  sets: [],
  search: '',
  colors: [],
  types: [],
  rarities: [],
  statuses: [],
  sort: {}
}

function filterReducer (state, action) {
  switch (action.type) {
    case 'set':
      return { ...state, sets: action.value }

    case 'search':
        return { ...state, search: action.value }

    case 'color':
      return { ...state, colors: action.value }

    case 'type':
      return { ...state, types: action.value }

    case 'rarity':
      return { ...state, rarities: action.value }

    case 'status':
      return { ...state, statuses: action.value }

    case 'clear':
      return initialState

    case 'sort':
      return {
        ...state,
        sort: {
          ...state.sort,
          field: action.field,
          order: action.order
        }
      }

    default: break
  }
}

function CardCollectionTable ({ tableLayout = layoutOptions.compact }) {
  // const cardSetSelect = React.useRef()
  // const searchInput = React.useRef()

  const [filter, dispatch] = React.useReducer(filterReducer, initialState)

  const cardStorage = useCardStorage()
  const filteredCards = useCardFilter(cardStorage, filter)
  const sortedCards = useCardSorting(filteredCards, filter.sort)
  const { items: cards, ...pagination } = usePagination(sortedCards, 50)

  const { visible, selectedCard, openCardDetails, closeCardDetails } = useCardModalControls()

  const Table = CardTableComponent[tableLayout]

  function onFilterChange (values) {
    values.color && dispatch({ type: 'color', value: values.color.params })
    values.type && dispatch({ type: 'type', value: values.type.params })
    values.rarity && dispatch({ type: 'rarity', value: values.rarity.params })
    values.status && dispatch({ type: 'status', value: values.status.params })
  }

  // function onClearFilters () {
  //   cardSetSelect.current.clear()
  //   searchInput.current.value = ''
  //   dispatch({ type: 'clear' })
  // }

  function onSearchClear () {
    dispatch({ type: 'search', value: '' })
  }

  function sortCards (field, order) {
    dispatch({ type: 'sort', field, order })
  }

  return (
    <>
      <SearchBar.InputBar>
        {/* <CardSetSelect ref={cardSetSelect} onChange={(value) => dispatch({ type: 'set', value })} />
        <ColorSelect ref={colorSelect} onChange={(value) => dispatch({ type: 'color', value })} />
        <TextInput
          ref={searchInput}
          spellCheck={false}
          placeholder={'Search...'}
          onChange={(e) => dispatch({ type: 'search', value: e.target.value })}
        />
        <Button size={'large'} type={'submit'}>Clear filters</Button> */}
        <InputBar>
          <CardSetSelect onChange={(value) => dispatch({ type: 'set', value })} />
          <SearchInput
            onChange={(value) => dispatch({ type: 'search', value })}
            onClear={onSearchClear}
          />
        </InputBar>
        <InputBar>
          <CardFilterBar onChange={onFilterChange} />
        </InputBar>
      </SearchBar.InputBar>
      <Table
        cards={cards}
        sortCards={sortCards}
        openCardInfo={openCardDetails}
      />
      <MenuBar.ContextMenu>
        {!cardStorage.empty() && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            next={pagination.next}
            previous={pagination.previous}
            onPageChangeSuccess={() => backToTop('table-container')}
          />
        )}
      </MenuBar.ContextMenu>
      <CardCollectionDetailsModal
        visible={visible}
        initialCard={selectedCard}
        onClose={closeCardDetails}
      />
    </>
  )
}

function CardTableCompact (props) {
  return (
    <CardTable.Compact
      {...props}
      renderHeader={() => (
        <>
          <DataTable.Header fitToContent>Grade</DataTable.Header>
          <DataTable.Header textAlign={'right'} fitToContent>Price</DataTable.Header>
        </>
      )}
      renderRow={({ card, meta }) => (
        <>
          <DataTable.Data textAlign={'center'}>
            <GradeContainer>
              <GradeTag grade={meta.grade} />
            </GradeContainer>
          </DataTable.Data>
          <DataTable.Data textAlign={'right'}>
            <PriceContainer>
              <PriceInput
                isReadOnly
                editInline
                value={meta.price}
              />
            </PriceContainer>
          </DataTable.Data>
        </>
      )}
    />
  )
}

function CardTableFull (props) {
  return (
    <CardTable.Full
      {...props}
      renderHeader={() => (
        <DataTable.Header fitToContent>asd</DataTable.Header>
      )}
      renderRow={({ card }) => (
        <DataTable.Data>qwe</DataTable.Data>
      )}
      renderDetails={({ card, meta }) => (
        <CardDetailsDataTable>
          <thead>
            <tr><th /><th /></tr>
          </thead>
          <tbody>
            <tr>
              <td><InfoText>Grade:</InfoText></td>
              <td>
                  <GradeSelect.Inline.Sm
                    value={gradeOptions[meta.grade]}
                  />
              </td>
            </tr>
            <tr>
              <td><InfoText>Price:</InfoText></td>
              <td>
                <PriceContainerFull>
                  <PriceInput value={meta.price} />
                </PriceContainerFull>
              </td>
            </tr>
          </tbody>
        </CardDetailsDataTable>
      )}
      // renderMenu={({ card }) => (
      //   cardDrawer.has(card) ? (
      //     <Button.Danger size={'small'} onClick={() => cardDrawer.remove(card)}>Remove</Button.Danger>
      //   ) : (
      //     <Button.Accept size={'small'} onClick={() => cardDrawer.add(card, { grade: Grade.nm })}>Add</Button.Accept>
      //   )
      // )}
    />
  )
}

const InputBar = styled('div')({
  display: 'flex',
  gap: 24,
  marginBottom: 24
})

const InfoText = styled('span')({
  color: Colors.control
})

const GradeContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center'
})

const PriceContainer = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end'
})

const PriceContainerFull = styled('div')({
  display: 'flex'
})

const CardTableComponent = {
  compact: CardTableCompact,
  details: CardTableFull
}

export default CardCollectionTable
