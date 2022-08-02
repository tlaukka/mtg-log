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
    const setRegExp = new RegExp(/set:\w+/i)
    const setInSearch = search.current.match(setRegExp)?.[0] || ''

    const set = setInSearch.replace('set:', '')
    const fuzzy = search.current.replace(setRegExp, '').trim()

    const params = {
      fuzzy,
      set
    }

    searchCard(params, { onSuccess: onSearchSuccess, onError: onSearchError })
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
            <CardDataTable card={card} />
            <MetaDataTable>
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
                  <td>
                    <PriceInputContainer>
                      <PriceInput disabled={!card} value={price} onChange={onChangePrice} />
                    </PriceInputContainer>
                  </td>
                </tr>
              </tbody>
            </MetaDataTable>
            <DetailsMenu>
              {isInCollection && (
                <RemoveButton
                  size={'small'}
                  disabled={!isInCollection}
                  onClick={() => cardDrawer.remove(card)}
                >
                  Remove
                </RemoveButton>
              )}
              {!isInCollection && (
                <AddButton
                  size={'small'}
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

const PriceInputContainer = styled('div')({
  display: 'flex'
})

const InfoText = styled('span')({
  color: Colors.control
})

const DetailsMenu = styled('div')({
  display: 'flex',
  gap: 8,
  padding: '4px 0'
})

const AddButton = styled(Button.Accept)({
  // lineHeight: '24px',
  // height: 24,
  padding: 0,
  borderRadius: 0,
  borderBottom: `1px solid ${Colors.accept}`,
  backgroundColor: 'transparent',
  ':hover': {
    borderColor: Colors.acceptLight
  }
})

const RemoveButton = styled(Button.Danger)({
  // lineHeight: '24px',
  // height: 24,
  padding: 0,
  borderRadius: 0,
  borderBottom: `1px solid ${Colors.decline}`,
  backgroundColor: 'transparent',
  ':hover': {
    borderColor: Colors.declineLight
  }
})

export default CardDetailsModal
