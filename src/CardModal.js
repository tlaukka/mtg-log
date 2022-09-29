import styled from '@emotion/styled'
import React from 'react'
import CardDetailsTable, { CardDetailsDataTable } from './CardDetailsTable'
import Colors from './Colors'
import ErrorMessage from './ErrorMessage'
import GradeSelect, { gradeOptions } from './GradeSelect'
import Icons from './Icon'
import LinkButton from './LinkButton'
import Modal from './Modal'
import PriceInput from './PriceInput'
import Spinner from './Spinner'

export function useCardModalControls () {
  const [visible, setVisible] = React.useState(false)
  const [selectedCard, setSelectedCard] = React.useState(null)

  const openCardDetails = React.useCallback(
    (card) => {
      setSelectedCard(card)
      setVisible(true)
    },
    []
  )

  const closeCardDetails = React.useCallback(
    () => {
      setSelectedCard(null)
      setVisible(false)
    },
    []
  )

  return {
    visible,
    selectedCard,
    openCardDetails,
    closeCardDetails
  }
}

function CardModal ({
  card,
  fetching,
  searchEnabled,
  onSearch,
  onClose,
  renderDetails = () => null,
  renderMenu = () => null,
  ...rest
}) {
  const search = React.useRef('')
  const searchInput = React.useRef()

  const [searchActive, setSearchActive] = React.useState(false)
  const [error, setError] = React.useState(null)

  function onSearchKeyDown (e) {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  function handleSearch () {
    if (search.current) {
      setError(null)
      onSearch && onSearch(search.current, onSearchSuccess, onSearchError)
    }
  }

  function onSearchSuccess () {
    search.current = ''
    searchInput.current.value = ''
    searchInput.current.blur()
  }

  function onSearchError (error) {
    searchInput.current.select()
    setError(error)
  }

  function handleClose () {
    search.current = ''
    setSearchActive(false)
    setError(null)
    onClose && onClose()
  }

  return (
    <Modal onClose={handleClose} {...rest}>
      <Wrapper>
        <CardDetailsSearchContainer>
          <CardDetailsSearch
            ref={searchInput}
            spellCheck={false}
            placeholder={'Search...'}
            onKeyDown={onSearchKeyDown}
            onFocus={() => setSearchActive(true)}
            onBlur={() => setSearchActive(false)}
            onChange={(e) => search.current = e.target.value}
          />
          {fetching ? (
            <SearchSpinner />
          ) : (
            <SearchButton active={searchActive} onClick={handleSearch}>
              <Icons.ArrowRight />
            </SearchButton>
          )}
          {error && (
            <SearchErrorMessage onClick={() => setError(null)}>
              {error.details}
            </SearchErrorMessage>
          )}
        </CardDetailsSearchContainer>
        <CardDetailsContainer>
          <CardImageContainer set={card?.set}>
            {card?.image_uris?.normal ? (
              <CardImage src={card.image_uris?.normal} alt={card.name} set={card.set} />
            ) : (
              <span>Image N/A</span>
            )}
          </CardImageContainer>
          <CardDetailsTableContainer>
            <CardDataTable card={card} />
            {renderDetails()}
            <DetailsMenu>
              {renderMenu()}
            </DetailsMenu>
          </CardDetailsTableContainer>
        </CardDetailsContainer>
      </Wrapper>
    </Modal>
  )
}

export function CardMetaDataTable ({ isReadOnly, card, meta, onChangeGrade, onChangePrice }) {
  return (
    <MetaDataTable>
      <thead>
        <tr><th /><th /></tr>
      </thead>
      <tbody>
        <tr>
          <td><InfoText>Grade:</InfoText></td>
          <td>
              <GradeSelect.Inline.Sm
                isReadOnly={isReadOnly}
                isDisabled={!card}
                value={gradeOptions[meta.grade]}
                onChange={onChangeGrade}
              />
          </td>
        </tr>
        <tr>
          <td><InfoText>Price (€):</InfoText></td>
          <PriceTableData>
            <PriceInputContainer>
              <PriceInput
                isReadOnly={isReadOnly}
                disabled={!card}
                value={meta.price}
                onChange={onChangePrice}
              />
            </PriceInputContainer>
          </PriceTableData>
        </tr>
      </tbody>
    </MetaDataTable>
  )
}

const stripes = `repeating-linear-gradient(
  -45deg,
  #2D2924,
  #2D2924 10px,
  #181510 10px,
  #181510 20px
)`

const Wrapper = styled('div')({
  width: '100%'
})

const CardDetailsSearchContainer = styled('div')({
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  position: 'relative',
  maxWidth: 818,
  margin: '0 auto',
  marginBottom: 48,
  borderBottom: `2px solid ${Colors.backgroundAccent}`
})

const SearchErrorMessage = styled(ErrorMessage)({
  position: 'absolute',
  bottom: -32,
  width: '100%'
})

const CardDetailsSearch = styled('input')({
  fontSize: 42,
  outline: 'none',
  width: '100%',
  border: 'none',
  color: Colors.control,
  backgroundColor: 'transparent',
  '::placeholder': {
    color: Colors.backgroundDark
  }
})

const SearchButton = styled(LinkButton)({
  fontSize: 42,
  padding: 0
}, ({ active }) => ({
  color: active ? Colors.control : Colors.backgroundAccent
}))

const SearchSpinner = styled(Spinner)({
  margin: '10px 13px'
})

const CardDetailsContainer = styled('div')({
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  gap: 18
})

const CardImageContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  aspectRatio: '488 / 680',
  width: '50%',
  maxWidth: 300,
  backgroundColor: '#181510',
  boxShadow: '0px 0px 4px 0px white',
  span: {
    zIndex: 1,
    color: Colors.control
  }
}, ({ set }) => ({
  borderRadius: (set === 'lea') ? '7.5%/5.4%' : '4.8%/3.4%',
  ':before': {
    content: '""',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 14,
    color: Colors.borderLight,
    background: stripes
  }
}))

const CardImage = styled('img')({
  display: 'block',
  position: 'absolute',
  width: '100%'
}, ({ set }) => ({
  clipPath: (set === 'lea') ? 'inset(0px round 7.5%/5.4%)' : 'inset(0px round 4.8%/3.4%)'
}))

const CardDetailsTableContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: 16,
  width: '100%',
  maxWidth: 500
})

const CardDataTable = styled(CardDetailsTable)({
  '> tbody': {
    '> tr:first-of-type': {
      borderBottom: `1px solid ${Colors.backgroundAccent}`
    }
  }
})

const MetaDataTable = styled(CardDetailsDataTable)({
  '> tbody': {
    '> tr': {
      '> td': {
        overflow: 'visible',
        maxWidth: 'none',
        padding: '0 0 4px 0'
      }
    }
  }
})

const PriceTableData = styled('td')({
  verticalAlign: 'bottom'
})

const PriceInputContainer = styled('div')({
  display: 'flex'
})

const InfoText = styled('span')({
  color: Colors.control
})

const DetailsMenu = styled('div')({
  display: 'flex',
  gap: 18,
  padding: '4px 0'
})

export default CardModal
