import styled from '@emotion/styled'
import React from 'react'
import Button from './Button'
import { useCardDrawer } from './CardDrawerProvider'
import { useCardSets } from './CardSetProvider'
import CardSetSymbol from './CardSetSymbol'
import Colors from './Colors'
import DataTable from './DataTable'
import { Grade } from './GradeSelect'
import Icons from './Icon'
import LinkButton from './LinkButton'
import Popup, { withPopupPosition } from './Popup'
import Tooltip from './Tooltip'
import CardImage from './CardImage'
import CardDetailsTable from './CardDetailsTable'

function CardTable ({ cards, sortCards, openCardInfo }) {
  const { sets } = useCardSets()
  const cardDrawer = useCardDrawer()

  return (
    <CardDataTable
      data={cards}
      renderHeader={() => (
        <>
          <DataTable.Header fitToContent>Set</DataTable.Header>
          <TableSortingHeader textAlign={'right'} fitToContent onClick={() => sortCards('set')}>№</TableSortingHeader>
          <DataTable.Header fitToContent>Res.</DataTable.Header>
          <DataTable.Header fitToContent></DataTable.Header>
          <TableSortingHeader textAlign={'left'} onClick={() => sortCards('name')}>Name</TableSortingHeader>
          <DataTable.Header fitToContent></DataTable.Header>
        </>
      )}
      renderRow={(card) => (
        <>
          <DataTable.Data>
            <CardSet set={sets[card.set]} rarity={card.rarity} />
          </DataTable.Data>
          <DataTable.Data textAlign={'right'} color={Colors.control}>{card.collector_number}</DataTable.Data>
          <DataTable.Data textAlign={'center'}><ReservedStatus reserved={card.reserved} /></DataTable.Data>
          <DataTable.Data noPadding><CardPreviewPopup card={card} /></DataTable.Data>
          <DataTable.Data>
            <CardName onClick={() => openCardInfo(card)}>{card.name}</CardName>
          </DataTable.Data>
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
        </>
      )}
    />
  )
}

export function CardTableFull ({ cards, openCardInfo }) {
  return (
    <CardDataTableFull
      data={cards}
      renderHeader={() => (
        <>
          <DataTable.Header fitToContent>Image</DataTable.Header>
          <DataTable.Header textAlign={'left'}>Details</DataTable.Header>
        </>
      )}
      renderRow={(card) => (
        <>
          <DataTable.Data>
            <CardImage src={card.image_uris.small} alt={card.name} set={card.set} />
          </DataTable.Data>
          <DataTable.Data>
            <CardDetailsContainer>
              <CardDetailsTable card={card} openCardInfo={openCardInfo} />
              <DetailsMenu>
                <AddButton>Add</AddButton>
                <RemoveButton>Remove</RemoveButton>
              </DetailsMenu>
            </CardDetailsContainer>
          </DataTable.Data>
        </>
      )}
    />
  )
}

function CardSet ({ set, rarity }) {
  return (
    <Tooltip text={`${set.name} - ${new Date(set.released_at).getFullYear()}`}>
      <CardSetContainer rarity={rarity}>
        <CardSetSymbol code={set.code} />
      </CardSetContainer>
    </Tooltip>
  )
}

function ReservedStatus ({ reserved }) {
  return reserved
    ? <Icons.Check style={{ color: Colors.accept }} fixedWidth={false} />
    : <Icons.Cross style={{ color: Colors.error }} fixedWidth={false} />
}

function CardPreviewPopup ({ card }) {
  return (
    <Popup content={<CardPreviewImage src={card.image_uris.small} alt={card.name} set={card.set} />}>
      <CardPreviewButton><Icons.Camera /></CardPreviewButton>
    </Popup>
  )
}

const CardDataTable = styled(DataTable)({
  '> thead': {
    '> tr': {
      '> th:first-of-type': {
        paddingLeft: 24
      },
      '> th:last-of-type': {
        paddingRight: 24
      }
    }
  },
  '> tbody': {
    fontSize: 16,
    '> tr': {
      '> td:first-of-type': {
        paddingLeft: 24
      },
      '> td:last-of-type': {
        paddingRight: 24
      }
    }
  }
})

const CardDataTableFull = styled(CardDataTable)({
  height: 1,
  '> tbody': {
    '> tr:not(:first-of-type)': {
      '> td:not(:first-of-type):not(:last-of-type)': {
        verticalAlign: 'top',
        padding: 12
      }
    }
  }
})

const TableSortingHeader = styled(DataTable.Header)({
  cursor: 'pointer',
  ':hover': {
    color: Colors.accept
  }
})

const CardName = styled('div')({
  cursor: 'pointer',
  display: 'inline-block',
  ':hover': {
    color: Colors.link
  }
})

const CardPreviewButton = styled(LinkButton)({
  fontSize: 16
})

const CardPreviewImage = withPopupPosition(styled('img')({
  display: 'block',
  aspectRatio: '488 / 680',
  width: 146
}, ({ set, position }) => {
  const styles = {
    borderRadius: (set === 'lea') ? '7.5%/5.4%' : '4.8%/3.4%'
  }

  if (position === 'top') {
    return {
      ...styles,
      bottom: 0
    }
  } else {
    return {
      ...styles,
      top: 0
    }
  }
}))

const CardSetContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 20,
  width: 28,
  height: 28,
  borderRadius: '100%',
  color: 'black',
}, ({ rarity = 'common' }) => ({
  backgroundColor: Colors[rarity] || Colors.foregroundLight
}))

const CardDetailsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  minWidth: 400
})

const DetailsMenu = styled('div')({
  display: 'flex',
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

export default CardTable
