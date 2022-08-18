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
import useCollection from './useCollection'
import MenuBar from './MenuBar'
import CardCollectionDetailsModal from './CardCollectionDetailsModal'
import { useCardModalControls } from './CardModal'
import Pagination from './Pagination'
import usePagination from './usePagination'
import GradeTag from './GradeTag'
import backToTop from './backToTop'
import SearchBar from './SearchBar'

function CardCollectionTable ({ tableLayout = layoutOptions.compact }) {
  const cardStorage = useCardStorage()
  const { items: cards, ...pagination } = usePagination(cardStorage, 50)

  const { visible, selectedCard, openCardDetails, closeCardDetails } = useCardModalControls()

  const Table = CardTableComponent[tableLayout]

  return (
    <>
      <SearchBar.InputBar>
        qwe
      </SearchBar.InputBar>
      <Table
        cards={cards}
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
  const cardStorage = useCardStorage()

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
