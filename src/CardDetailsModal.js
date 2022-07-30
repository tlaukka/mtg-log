import styled from '@emotion/styled'
import React from 'react'
import { useCardDrawer } from './CardDrawerProvider'
import { useCardSets } from './CardSetProvider'
import Colors from './Colors'
import GradeSelect, { Grade, gradeOptions } from './GradeSelect'
import Icons from './Icon'
import LinkButton from './LinkButton'
import Spinner from './Spinner'
import Modal from './Modal'
import PriceInput from './PriceInput'
import useCardNameSearch from './useCardNameSearch'
import CardDetailsTable, { CardDetailsDataTable } from './CardDetailsTable'
import Button from './Button'

function CardDetailsModal ({ initialCard, onClose, ...rest }) {
  const search = React.useRef('')
  const searchInput = React.useRef()

  const [searchedCard, setSearchedCard] = React.useState()
  const [error, setError] = React.useState()
  const [searchActive, setSearchActive] = React.useState(false)
  const [selectedGrade, setSelectedGrade] = React.useState(Grade.nm)
  const [selectedPrice, setSelectedPrice] = React.useState()

  const { sets } = useCardSets()
  const cardDrawer = useCardDrawer()

  const { searchCard, fetching } = useCardNameSearch()

  const card = searchedCard || initialCard
  const set = sets[card?.set] || {}
  const isInCollection = cardDrawer.has(card || {})

  const grade = isInCollection ? cardDrawer.get(card.id).meta.grade : selectedGrade
  const price = isInCollection ? cardDrawer.get(card.id).meta.price : selectedPrice

  function onSearchKeyDown (e) {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  function onSearch () {
    searchCard(search.current, { onSuccess: onSearchSuccess, onError: onSearchError })
    setError(null)
  }

  function onSearchSuccess (card) {
    search.current = ''
    searchInput.current.value = ''
    searchInput.current.blur()
    setSearchedCard(card)
  }

  function onSearchError (error) {
    searchInput.current.select()
    setError(error)
  }

  function onChangeGrade (grade) {
    if (isInCollection) {
      cardDrawer.updateGrade(card.id, grade)
    } else {
      setSelectedGrade(grade)
    }
  }

  function onChangePrice (price) {
    if (isInCollection) {
      cardDrawer.updatePrice(card.id, price)
    } else {
      setSelectedPrice(price)
    }
  }

  function handleClose () {
    search.current = ''

    setSearchActive(false)
    setSelectedPrice('')
    setSelectedGrade(Grade.nm)
    setSearchedCard(null)

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
            <SearchButton active={searchActive} onClick={onSearch}>
              <Icons.ArrowRight />
            </SearchButton>
          )}
          {error && (
            <SearchErrorContainer>
              <LinkButton.Danger onClick={() => setError(null)}>
                <Icons.Cross />
              </LinkButton.Danger>
              {error.details}
            </SearchErrorContainer>
          )}
        </CardDetailsSearchContainer>
        <CardDetailsContainer>
          <CardImageContainer set={set.code}>
            {card && (
              <CardImage src={card.image_uris.normal} alt={card.name} set={set.code} />
            )}
          </CardImageContainer>
          <CardDetailsTableContainer>
            <CardDetailsTable card={card} />
            <Table>
              <thead>
                <tr><th /><th /></tr>
              </thead>
              <tbody>
                <tr>
                  <td><InfoText>Grade:</InfoText></td>
                  <td>
                      <GradeSelect.Inline.Sm
                        isDisabled={!card}
                        value={gradeOptions[grade]}
                        onChange={onChangeGrade}
                      />
                  </td>
                </tr>
                <tr>
                  <td><InfoText>Price (€):</InfoText></td>
                  <PriceTableData>
                    <PriceInput disabled={!card} value={price} onChange={onChangePrice} />
                  </PriceTableData>
                </tr>
              </tbody>
            </Table>
            <DetailsMenu>
              {isInCollection && (
                <RemoveButton
                  disabled={!isInCollection}
                  onClick={() => cardDrawer.remove(card)}
                >
                  Remove
                </RemoveButton>
              )}
              {!isInCollection && (
                <AddButton
                  disabled={!card}
                  onClick={() => cardDrawer.add(card, { grade, price })}
                >
                  Add
                </AddButton>
              )}
            </DetailsMenu>
          </CardDetailsTableContainer>
        </CardDetailsContainer>
      </Wrapper>
    </Modal>
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
  width: '100%',
  marginTop: '8%',
  marginBottom: 32
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

const SearchErrorContainer = styled('div')({
  fontSize: 14,
  lineHeight: '28px',
  position: 'absolute',
  bottom: -28,
  width: '100%',
  height: 28,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: Colors.error,
  backgroundColor: 'transparent',
  button: {
    lineHeight: '28px',
    height: 28,
    padding: '0 4px'
  }
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
  boxShadow: '0px 0px 4px 0px white'
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
  justifyContent: 'space-between',
  gap: 16,
  width: '100%',
  // height: '100%',
  maxWidth: 500
})

const CardInfo = styled('div')({
  flex: 1,
  maxWidth: 500,
  h1: {
    fontSize: 20,
    margin: 0,
    span: {
      marginRight: 8,
      color: Colors.control,
      span: {
        fontSize: 12
      }
    }
  }
})

const Table = styled(CardDetailsDataTable)({
  '> tbody': {
    '> tr': {
      '> td': {
        overflow: 'visible'
      }
    }
  }
})

const PriceTableData = styled('td')({
  display: 'flex'
})

const InfoText = styled('span')({
  color: Colors.control
})

const DetailsMenu = styled('div')({
  display: 'flex',
  flex: 1,
  alignItems: 'flex-end',
  gap: 8,
  marginBottom: 8
})

const AddButton = styled(Button.Accept)({
  height: 24,
  lineHeight: '24px'
})

const RemoveButton = styled(Button.Danger)({
  height: 24,
  lineHeight: '24px'
})

export default CardDetailsModal
