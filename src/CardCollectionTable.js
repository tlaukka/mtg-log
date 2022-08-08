import React from 'react'
import styled from '@emotion/styled'
import Button from './Button'
import { Route, useRoute } from './RouteProvider'
import CardTable from './CardTable'
import { useCardStorage } from './CardStorageProvider'
import DataTable from './DataTable'
import { layoutOptions } from './TableLayoutSelect'
import GradeSelect, { gradeOptions } from './GradeSelect'
import PriceInput from './PriceInput'
import { CardDetailsDataTable } from './CardDetailsTable'
import Colors from './Colors'
import useCollection from './useCollection'

function CardCollectionTable ({ tableLayout = layoutOptions.compact, openCardInfo }) {
  // const cardStorage = useCardStorage()
  const cardStorage = useCardStorage()

  const Table = CardTableComponent[tableLayout]

  return (
    <>
      <Table
        // cards={cardStorage.cardCollection.toArray()}
        cards={cardStorage.toArray()}
        openCardInfo={openCardInfo}
      />
    </>
  )
}

function CardTableCompact (props) {
  // const { cardCollection } = useCardStorage()
  const cardStorage = useCardStorage()
  const updates = useCollection()

  function updateGrade (card, grade) {
    cardStorage.updateGrade(card.id, grade)
    updates.add(card)
  }

  function updatePrice (card, price) {
    cardStorage.updatePrice(card.id, price)
    updates.add(card)
  }

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
          <DataTable.Data textAlign={'center'} style={{ backgroundColor: updates.has(card) ? 'gray' : 'inherit' }}>
            <GradeContainer>
              <GradeSelect.Inline.Sm
                value={gradeOptions[meta.grade]}
                // onChange={(grade) => cardStorage.updateGrade(card.id, grade)}
                onChange={(grade) => updateGrade(card, grade)}
              />
            </GradeContainer>
          </DataTable.Data>
          <DataTable.Data textAlign={'right'}>
            <PriceContainer>
              <PriceInput
                editInline
                value={meta.price}
                // onChange={(price) => cardStorage.updatePrice(card.id, price)}
                onChange={(price) => updatePrice(card, price)}
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
