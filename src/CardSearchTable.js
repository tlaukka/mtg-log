import React from 'react'
import Button from './Button'
import { useCardDrawer } from './CardDrawerProvider'
import { useCardStorage } from './CardStorageProvider'
import CardTable from './CardTable'
import DataTable from './DataTable'
import { Grade } from './GradeSelect'
import Icons from './Icon'
import LinkButton from './LinkButton'
import MenuBar from './MenuBar'
import { layoutOptions } from './TableLayoutSelect'
import backToTop from './backToTop'

function CardSearchTable ({
  cards,
  meta,
  next,
  previous,
  tableLayout = layoutOptions.compact,
  sortCards,
  openCardInfo
}) {
  const Table = CardTableComponent[tableLayout]

  function onPageChange (fn) {
    fn({ onSuccess: () => backToTop('table-container') })
  }

  return (
    <>
      <Table
        cards={cards}
        sortCards={sortCards}
        openCardInfo={openCardInfo}
      />
      <MenuBar.ContextMenu>
        {(cards.length > 0) && (
          <>
            {meta.totalCards && <MenuBar.Item>{`Total cards: ${meta.totalCards}`}</MenuBar.Item>}
            {meta.page && <MenuBar.Item>{`${meta.page} / ${meta.totalPages}`}</MenuBar.Item>}
            <MenuBar.Button disabled={!previous} onClick={() => onPageChange(previous)}>
              <Icons.ChevronLeft />Previous
            </MenuBar.Button>
            <MenuBar.Button disabled={!next} onClick={() => onPageChange(next)}>
              Next<Icons.ChevronRight />
            </MenuBar.Button>
          </>
        )}
      </MenuBar.ContextMenu>
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

const CardTableComponent = {
  compact: CardTableCompact,
  details: CardTableFull
}

export default CardSearchTable