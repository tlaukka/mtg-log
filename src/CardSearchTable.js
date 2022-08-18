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
import TextInput from './TextInput'
import CardSetSelect from './CardSetSelect'
import ColorSelect from './ColorSelect'
import styled from '@emotion/styled'
import useCardSearch from './useCardSearch'

function CardSearchTable ({ tableLayout = layoutOptions.compact }) {
  const order = React.useRef('name')
  const search = React.useRef('')
  const selectedSets = React.useRef([])
  const selectedColors = React.useRef([])

  const { visible, selectedCard, openCardDetails, closeCardDetails } = useCardModalControls()
  const { cards, meta, fetching, searchCards, next, previous } = useCardSearch()

  const Table = CardTableComponent[tableLayout]

  function onSearch () {
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

  return (
    <>
      <SearchBar.InputBar onSubmit={onSearch}>
        <CardSetSelect onChange={(value) => selectedSets.current = value} />
        <ColorSelect onChange={(value) => selectedColors.current = value} />
        <Search
          spellCheck={false}
          placeholder={'Search...'}
          onChange={(e) => search.current = e.target.value}
        />
        <Button size={'large'} type={'submit'}>Get cards!</Button>
      </SearchBar.InputBar>
      <Table
        cards={cards}
        sortCards={sortCards}
        openCardInfo={openCardDetails}
      />
      <MenuBar.ContextMenu>
        {(cards.length > 0) && (
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

const Search = styled(TextInput)({
  flex: 1,
  maxWidth: 500
})

const CardTableComponent = {
  compact: CardTableCompact,
  details: CardTableFull
}

export default CardSearchTable