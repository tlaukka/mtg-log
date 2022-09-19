import React from 'react'
import Button from './Button'
import { useCardDrawer } from './CardDrawerProvider'
import { useCardStorage } from './CardStorageProvider'
import CardTable from './CardTable'
import DataTable from './DataTable'
import { Grade } from './GradeTag'
import Icons from './Icon'
import LinkButton from './LinkButton'
import MenuBar from './MenuBar'
import { layoutOptions } from './TableLayoutSelect'
import backToTop from './backToTop'
import CardSearchDetailsModal from './CardSearchDetailsModal'
import { useCardModalControls } from './CardModal'
import Pagination from './Pagination'
import SearchBar from './SearchBar'
import CardSetSelect from './CardSetSelect'
import styled from '@emotion/styled'
import { useCardSearch } from './CardSearchProvider'
import SearchInput from './SearchInput'
import CardFilterBar from './CardFilterBar'
import FadeIn from './FadeIn'

const SearchKeyword = {
  set: new RegExp(/set:\w+/gi),
  color: new RegExp(/[c|t]:\w+/gi)
}

function getSearchKeywords (search, keyword) {
  return search.match(keyword) || []
}

function getSearchString (search, filters, order) {
  const searchParams = filters.reduce((result, entry) => {
    result += `${entry.operator}(${entry.params.join(' OR ')})`
    return result
  }, '')

  const orderParam = order ? `order:${order}` : ''

  return `${searchParams} ${orderParam} ${search}`
}

function CardSearchTable ({ tableLayout = layoutOptions.compact }) {
  const order = React.useRef('name')
  const search = React.useRef('')
  const selectedSets = React.useRef({ operator: 'AND', params: [] })
  const filter = React.useRef({})

  const [scryfallMode, setScryfallMode] = React.useState(false)

  const { visible, selectedCard, openCardDetails, closeCardDetails } = useCardModalControls()
  const { cards, meta, fetching, searchCards, next, previous } = useCardSearch()

  const Table = CardTableComponent[tableLayout]

  function getCards () {
    if (scryfallMode) {
      searchCards(search.current.slice(1))
      return
    }

    const filters = Object.values({ ...filter.current, set: selectedSets.current })

    const searchString = getSearchString(search.current, filters, order.current)
    console.log(searchString)

    searchCards(searchString)
  }

  function onSearch () {
    getCards()
  }

  function onSearchChange (value) {
    search.current = value

    if (!scryfallMode && search.current.startsWith('/')) {
      setScryfallMode(true)
    }

    if (scryfallMode && !search.current.startsWith('/')) {
      setScryfallMode(false)
    }
  }

  function onSearchClear () {
    search.current = ''
    setScryfallMode(false)
  }

  function onSearchPaste (e) {
    if (e.clipboardData.getData('text').startsWith('/')) {
      setScryfallMode(true)
    }
  }

  function onFilterChange (values) {
    const result = {
      ...values,
      color: {
        ...values.color,
        params: [...values.color?.params || [], ...values.type?.params || []]
      }
    }

    delete result.type
    filter.current = result
  }

  function sortCards (newOrder) {
    order.current = newOrder
    getCards()
  }

  return (
    <>
      <SearchBar.InputBar onSubmit={onSearch}>
        <InputBar>
          <CardSetSelect isDisabled={scryfallMode} onChange={(value) => selectedSets.current.params = value} />
          <SearchInput
            fetching={fetching}
            onChange={onSearchChange}
            onClear={onSearchClear}
            onPaste={onSearchPaste}
          />
        </InputBar>
        <CardFilterBar disabled={scryfallMode} onChange={onFilterChange} />
      </SearchBar.InputBar>
      <FadeIn>
        <Table
          cards={cards.toArray()}
          sortCards={sortCards}
          openCardInfo={openCardDetails}
        />
      </FadeIn>
      {/* <Table
        cards={cards.toArray()}
        sortCards={sortCards}
        openCardInfo={openCardDetails}
      /> */}
      <MenuBar.ContextMenu>
        {!cards.empty() && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.totalCards}
            next={next}
            previous={previous}
            onPageChangeSuccess={() => backToTop('table-container')}
          />
        )}
      </MenuBar.ContextMenu>
      <CardSearchDetailsModal
        visible={visible}
        initialCard={selectedCard}
        onClose={closeCardDetails}
      />
    </>
  )
}

function CardTableCompact (props) {
  const cardDrawer = useCardDrawer()
  const cardStorage = useCardStorage()

  function renderMenu ({ card }) {
    if (cardStorage.has(card)) {
      return (
        <DataTable.Data>
          <LinkButton disabled><Icons.Check /></LinkButton>
        </DataTable.Data>
      )
    }

    return (
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
    )
  }

  return (
    <CardTable.Compact
      {...props}
      renderHeader={() => (
        <DataTable.Header fitToContent></DataTable.Header>
      )}
      renderRow={renderMenu}
    />
  )
}

function CardTableFull (props) {
  const cardDrawer = useCardDrawer()
  const cardStorage = useCardStorage()

  function renderMenu ({ card }) {
    if (cardStorage.has(card)) {
      return (
        <Button size={'small'} disabled>Owned</Button>
      )
    }

    return (
      cardDrawer.has(card) ? (
        <Button.Danger size={'small'} onClick={() => cardDrawer.remove(card)}>
          Remove
        </Button.Danger>
      ) : (
        <Button.Accept size={'small'} onClick={() => cardDrawer.add(card, { grade: Grade.nm })}>
          Add
        </Button.Accept>
      )
    )
  }

  return (
    <CardTable.Full
      {...props}
      renderMenu={renderMenu}
    />
  )
}

const InputBar = styled('div')({
  display: 'flex',
  gap: 24,
  // marginBottom: 24
  marginBottom: 30,
  // overflowX: 'auto',
  // overflowY: 'hidden',
})

const CardTableComponent = {
  compact: CardTableCompact,
  details: CardTableFull
}

export default CardSearchTable