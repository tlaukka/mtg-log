import React, { Children } from 'react'
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
import { useCardSearch } from './CardSearchProvider'
import Colors from './Colors'
import Checkbox from './Checkbox'
import CardSymbols from './CardSymbols'
import Rarity from './Rarity'
import Spinner from './Spinner'

const SearchKeyword = {
  set: new RegExp(/set:\w+/gi),
  color: new RegExp(/[c|t]:\w+/gi)
}

function getSearchKeywords (search, keyword) {
  return search.match(keyword) || []
}

function getSearchString (search, params, order) {
  const searchParams = params.reduce((result, entry) => {
    result += `(${entry.join(' OR ')})`
    return result
  }, '')

  const orderParam = order ? `order:${order}` : ''

  return `${searchParams} ${orderParam} ${search}`
}

function CardSearchTable ({ tableLayout = layoutOptions.compact }) {
  const order = React.useRef('name')
  const search = React.useRef('')
  const selectedSets = React.useRef([])
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

    const searchString = getSearchString(
      search.current,
      Object.values(filter.current),
      order.current
    )
    console.log(searchString)

    searchCards(searchString)
  }

  function onSearch () {
    getCards()
  }

  function onSearchChange (value) {
    search.current = value

    if (search.current.length === 1) {
      if (search.current.startsWith('/')) {
        setScryfallMode(true)
      }
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
    const result = Object.entries(values).reduce((result, [key, value]) => {
      const params = Object.entries(value).reduce((result, [key, value]) => {
        if (value) {
          result.push(key)
        }

        return result
      }, [])

      result[key] = params
      return result
    }, {})

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
          <CardSetSelect isDisabled={scryfallMode} onChange={(value) => selectedSets.current = value} />
          <SearchInput
            fetching={fetching}
            onSearchChange={onSearchChange}
            onClear={onSearchClear}
            onPaste={onSearchPaste}
          />
        </InputBar>
        <InputBar>
          <CardFilterBar disabled={scryfallMode} onChange={onFilterChange} />
        </InputBar>
      </SearchBar.InputBar>
      <Table
        cards={cards.toArray()}
        sortCards={sortCards}
        openCardInfo={openCardDetails}
      />
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

function CardFilterBar ({ disabled, onChange }) {
  const values = React.useRef({})

  function handleChange (filter, filterValues) {
    values.current[filter] = {
      ...values.current[filter],
      ...filterValues
    }

    onChange && onChange(values.current)
  }

  return (
    <>
      <FilterSection disabled={disabled} rows={2} columns={3} label={'Color'} onChange={(values) => handleChange('color', values)}>
        <FilterItem value={'c:white'}><CardSymbols.Plains />White</FilterItem>
        <FilterItem value={'c:blue'}><CardSymbols.Island />Blue</FilterItem>
        <FilterItem value={'c:red'}><CardSymbols.Mountain />Red</FilterItem>
        <FilterItem value={'c:green'}><CardSymbols.Forest />Green</FilterItem>
        <FilterItem value={'c:black'}><CardSymbols.Swamp />Black</FilterItem>
        <FilterItem value={'c:colorless'}><CardSymbols.Colorless />Colorless</FilterItem>
      </FilterSection>
      <FilterSection disabled={disabled} rows={2} columns={2} label={'Type'} onChange={(values) => handleChange('color', values)}>
        <FilterItem value={'c:multicolor'}><CardSymbols.Multicolor />Multicolor</FilterItem>
        <FilterItem value={'t:land'}><CardSymbols.Land />Land</FilterItem>
        <FilterItem value={'t:artifact'}><CardSymbols.Artifact />Artifact</FilterItem>
      </FilterSection>
      <FilterSection disabled={disabled} rows={2} columns={2} label={'Rarity'} onChange={(values) => handleChange('rarity', values)}>
        <FilterItem value={'r:mythic'}><span style={{ color: Colors.mythic }}>Mythic</span></FilterItem>
        <FilterItem value={'r:rare'}><span style={{ color: Colors.rare }}>Rare</span></FilterItem>
        <FilterItem value={'r:uncommon'}><span style={{ color: Colors.uncommon }}>Uncommon</span></FilterItem>
        <FilterItem value={'r:common'}><span style={{ color: Colors.common }}>Common</span></FilterItem>
      </FilterSection>
      <FilterSection disabled={disabled} rows={2} columns={1} onChange={(values) => handleChange('reserved', values)}>
        <FilterItem  value={'is:reserved'}>Reserved</FilterItem>
      </FilterSection>
    </>
  )
}

function FilterSection ({ onChange, children, ...rest }) {
  const values = React.useRef({})

  function handleChange (checked, value) {
    values.current[value] = checked
    onChange && onChange(values.current)
  }

  return (
    <FilterSectionContainer {...rest}>
      {Children.map(children, (child) => (
        React.cloneElement(child, {
          onChange: (checked) => handleChange(checked, child.props.value)
        })
      ))}
    </FilterSectionContainer>
  )
}

function FilterItem ({ value, children, ...rest }) {
  return (
    <Checkbox value={value} {...rest}>
      {children}
    </Checkbox>
  )
}

function SearchInput ({ fetching, onSearchChange, onClear, ...rest }) {
  const input = React.useRef()

  const [search, setSearch] = React.useState('')

  function handleSearchChange (e) {
    setSearch(e.target.value)
    onSearchChange && onSearchChange(e.target.value)
  }

  function handleClear () {
    setSearch('')
    input.current.value = ''
    onClear && onClear()
  }

  return (
    <SearchContainer>
      <Search
        ref={input}
        spellCheck={false}
        placeholder={'Search...'}
        onChange={handleSearchChange}
        {...rest}
      />
      {search && (
        <SearchClear onClick={handleClear}>
          <Icons.Cross />
        </SearchClear>
      )}
      <SearchButtonSeparator />
      {fetching ? (
        <SearchSpinnerContainer>
          <Spinner size={16} />
        </SearchSpinnerContainer>
      ) : (
        <SearchButton type={'submit'}>
          <Icons.ArrowRight />
        </SearchButton>
      )}
    </SearchContainer>
  )
}

const InputBar = styled('div')({
  display: 'flex',
  gap: 24,
  marginBottom: 24
})

const FilterSectionContainer = styled('div')({
  display: 'grid',
  rowGap: 8,
  columnGap: 12,
  position: 'relative',
  ':before': {
    content: '""',
    position: 'absolute',
    bottom: -16,
    width: '100%',
    height: 4,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderStyle: 'solid',
    borderColor: Colors.foregroundDark
  }
}, ({ disabled, rows, columns, label }) => ({
  gridTemplateRows: `repeat(${rows}, 1fr)`,
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
  ':after': {
    content: `"${label}"`,
    display: label ? 'block' : 'none',
    fontSize: 14,
    lineHeight: '16px',
    position: 'absolute',
    left: '50%',
    bottom: -22,
    transform: 'translateX(-50%)',
    height: 16,
    padding: '0 8px',
    color: Colors.foregroundDark,
    backgroundColor: Colors.backgroundLight
  },
  div: {
    pointerEvents: disabled ? 'none' : 'auto'
  },
  'div div i': {
    filter: `brightness(${disabled ? 0.55 : 1}) grayscale(${disabled ? 1 : 0})`
  },
  'div label': {
    filter: `brightness(${disabled ? 0.55 : 1})`
  },
  'div label i': {
    filter: `grayscale(${disabled ? 1 : 0})`
  }
}))

const SearchContainer = styled('div')({
  display: 'flex',
  flex: 2,
  justifyContent: 'center',
  position: 'relative',
  borderBottom: `2px solid ${Colors.foregroundDark}`
})

const Search = styled('input')({
  flex: 1,
  fontSize: 31,
  outline: 'none',
  border: 'none',
  color: Colors.control,
  backgroundColor: Colors.backgroundLight,
  '::placeholder': {
    color: Colors.foregroundDark
  }
})

const SearchButtonSeparator = styled('span')({
  width: 1,
  margin: '8px 0',
  backgroundColor: Colors.foregroundDark
})

const searchButtonStyles = {
  fontSize: 22,
  lineHeight: '38px',
  width: 38,
  height: 38,
  padding: 0,
  backgroundColor: Colors.backgroundLight
}

const SearchButton = styled(LinkButton)({
  ...searchButtonStyles
})

const SearchClear = styled(LinkButton.Decline)({
  ...searchButtonStyles
})

const SearchSpinnerContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 38,
  height: 38
})

const CardTableComponent = {
  compact: CardTableCompact,
  details: CardTableFull
}

export default CardSearchTable