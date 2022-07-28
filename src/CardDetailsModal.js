import styled from '@emotion/styled'
import React from 'react'
import { useCardDrawer } from './CardDrawerProvider'
import { useCardSets } from './CardSetProvider'
import CardSetSymbol from './CardSetSymbol'
import Colors from './Colors'
import GradeSelect, { Grade, gradeOptions } from './GradeSelect'
import Icons from './Icon'
import LinkButton from './LinkButton'
import Spinner from './Spinner'
import Modal from './Modal'
import PriceInput from './PriceInput'
import useCardNameSearch from './useCardNameSearch'

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
          <CardInfo>
            <Table>
              <thead><tr><th /><th /></tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <h1><span>№ {card?.collector_number || '-'}/<span>{set.card_count || '-'}</span></span></h1>
                  </td>
                  <td><h1>{card?.name || '[Card name]'}</h1></td>
                </tr>
                <TableRowSpacer />
                <tr>
                  <td rowSpan={2}>
                    <InfoText><CardSetSymbol code={set.code} size={42} fixedWidth={false} /></InfoText>
                  </td>
                  <td><InfoText>{set.name || '[Card set]'}</InfoText></td>
                </tr>
                <tr>
                  <td>
                    <InfoText>
                      {card ? (
                        <InfoText>Released - {new Date(set.released_at).getFullYear()}</InfoText>
                      ) : (
                        <InfoText>[Release year]</InfoText>
                      )}
                    </InfoText>
                  </td>
                </tr>
                <TableRowSpacer />
                <tr>
                  <td><InfoText>Rarity:</InfoText></td>
                  <td>
                    <InfoText>
                      <Rarity rarity={card?.rarity}>{card?.rarity?.toUpperCase() || '-'}</Rarity>
                    </InfoText>
                  </td>
                </tr>
                <tr>
                  <td><InfoText>Reserved:</InfoText></td>
                  <td>
                    <InfoText>
                      <ReservedStatus reserved={card?.reserved || '-'}>
                        {card ? (
                          card.reserved ? 'YES' : 'NO'
                        ) : (
                          '-'
                        )}
                      </ReservedStatus>
                    </InfoText>
                  </td>
                </tr>
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
            <AddContainer>
              {isInCollection && (
                <LinkButton.Danger
                  disabled={!isInCollection}
                  onClick={() => cardDrawer.remove(card)}
                >
                  Remove
                </LinkButton.Danger>
              )}
              {!isInCollection && (
                <LinkButton.Accept
                  disabled={!card}
                  onClick={() => cardDrawer.add(card, { grade, price })}
                >
                  Add
                </LinkButton.Accept>
              )}
            </AddContainer>
          </CardInfo>
        </CardDetailsContainer>
      </Wrapper>
    </Modal>
  )
}

const stripes = `repeating-linear-gradient(
  -45deg,
  ${Colors.backgroundDark},
  ${Colors.backgroundDark} 10px,
  ${Colors.backgroundLight} 10px,
  ${Colors.backgroundLight} 20px
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
  flex: 1,
  outline: 'none',
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
  background: stripes,
  boxShadow: '0px 0px 4px 0px white'
}, ({ set }) => ({
  borderRadius: (set === 'lea') ? 22 : 14,
  ':before': {
    content: '"[card]"',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: '488 / 680',
    width: '95%',
    borderRadius: (set === 'lea') ? 16 : 8,
    color: Colors.borderLight,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  }
}))

const CardImage = styled('img')({
  position: 'absolute',
  width: '100%'
}, ({ set }) => ({
  clipPath: (set === 'lea') ? 'inset(0px round 22px)' : 'inset(0px round 14px)'
}))

const CardInfo = styled('div')({
  flex: 1,
  maxWidth: 500,
  'h1': {
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

const Table = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  th: {
    padding: 0,
    ':nth-of-type(1)': {
      width: 120
    }
  },
  tbody: {
    'tr:first-of-type': {
      borderBottom: `1px solid ${Colors.backgroundAccent}`
    },
    td: {
      paddingBottom: 4
    }
  }
})

const PriceTableData = styled('td')({
  display: 'flex'
})

const TableRowSpacer = styled('tr')({
  height: 12
})

const InfoText = styled('span')({
  color: Colors.control
})

const ReservedStatus = styled('span')({
  fontWeight: 'bold'
}, ({ reserved }) => {
  if (reserved === '-') {
    return Colors.control
  }

  return {
    color: reserved ? Colors.accept : Colors.error
  }
})

const Rarity = styled('span')({
  fontWeight: 'bold'
}, ({ rarity }) => ({
  color: Colors[rarity]
}))

const AddContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  margin: '64px 0 24px',
  borderTop: `1px solid ${Colors.backgroundAccent}`
})

export default CardDetailsModal
