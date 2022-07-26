import styled from '@emotion/styled'
import React from 'react'
import { useCardDrawer } from './CardDrawerProvider'
import { useCardSets } from './CardSetProvider'
import CardSetSymbol from './CardSetSymbol'
import Colors from './Colors'
import GradeSelect, { Grade, gradeOptions } from './GradeSelect'
import LinkButton from './LinkButton'
import Modal from './Modal'
import PriceInput from './PriceInput'

function CardDetailsModal ({ card, onClose, ...rest }) {
  const [selectedGrade, setSelectedGrade] = React.useState(Grade.nm)
  const [selectedPrice, setSelectedPrice] = React.useState()

  const { sets } = useCardSets()
  const cardDrawer = useCardDrawer()

  if (!card) {
    return null
  }

  const set = sets[card.set] || {}
  const isInCollection = cardDrawer.has(card)

  const grade = isInCollection ? cardDrawer.get(card.id).meta.grade : selectedGrade
  const price = isInCollection ? cardDrawer.get(card.id).meta.price : selectedPrice

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
    setSelectedPrice('')
    setSelectedGrade(Grade.nm)
    onClose && onClose()
  }

  return (
    <Modal onClose={handleClose} {...rest}>
      <Container>
        <CardImageContainer set={set.code}>
          <CardImage src={card.image_uris.normal} alt={card.name} set={set.code} />
        </CardImageContainer>
        <CardInfo>
          <Table>
            <thead><tr><th /><th /></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <h1><span>№ {card.collector_number}/<span>{set.card_count}</span></span></h1>
                </td>
                <td><h1>{card.name}</h1></td>
              </tr>
              <TableRowSpacer />
              <tr>
                <td rowSpan={2}>
                  <InfoText><CardSetSymbol code={set.code} size={42} fixedWidth={false} /></InfoText>
                </td>
                <td><InfoText>{set.name}</InfoText></td>
              </tr>
              <tr>
                <td><InfoText>Released - {new Date(set.released_at).getFullYear()}</InfoText></td>
              </tr>
              <TableRowSpacer />
              <tr>
                <td><InfoText>Rarity:</InfoText></td>
                <td>
                  <InfoText><Rarity rarity={card.rarity}>{card.rarity.toUpperCase()}</Rarity></InfoText>
                </td>
              </tr>
              <tr>
                <td><InfoText>Reserved:</InfoText></td>
                <td>
                  <InfoText>
                    <ReservedStatus reserved={card.reserved}>{card.reserved ? 'YES' : 'NO'}</ReservedStatus>
                  </InfoText>
                </td>
              </tr>
              <tr>
                <td><InfoText>Grade:</InfoText></td>
                <td>
                    <GradeSelect.Inline.Sm
                      value={gradeOptions[grade]}
                      onChange={onChangeGrade}
                    />
                </td>
              </tr>
              <tr>
                <td><InfoText>Price (€):</InfoText></td>
                <PriceTableData>
                  <PriceInput value={price} onChange={onChangePrice} />
                </PriceTableData>
              </tr>
            </tbody>
          </Table>
          <AddContainer>
            <LinkButton.Accept
              disabled={isInCollection}
              onClick={() => cardDrawer.add(card, { grade, price })}
            >
              Add
            </LinkButton.Accept>
            <LinkButton.Danger
              disabled={!isInCollection}
              onClick={() => cardDrawer.remove(card)}
            >
              Remove
            </LinkButton.Danger>
          </AddContainer>
        </CardInfo>
      </Container>
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

const Container = styled('div')({
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
}, ({ reserved }) => ({
  color: reserved ? Colors.accept : Colors.error
}))

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
