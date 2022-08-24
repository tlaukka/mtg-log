import styled from '@emotion/styled'
import React from 'react'
import { useCardSets } from './CardSetProvider'
import CardSetSymbol from './CardSetSymbol'
import Colors from './Colors'
import DataTable from './DataTable'
import Icons from './Icon'
import LinkButton from './LinkButton'
import Popup, { withPopupPosition } from './Popup'
import Tooltip from './Tooltip'
import CardImage from './CardImage'
import CardDetailsTable from './CardDetailsTable'
import { rarityBackground, rarityBorderColor } from './Rarity'

function Compact ({ cards, sortCards, openCardInfo, renderHeader = () => null, renderRow = () => null }) {
  const [activeSortingField, setActiveSortingField] = React.useState()

  const { sets } = useCardSets()

  function handleSort (field, order) {
    sortCards(field, order)
    setActiveSortingField(field)
  }

  return (
    <CardDataTable
      data={cards}
      keyExtractor={({ card }) => card.id}
      renderHeader={() => (
        <>
          <DataTable.Header width={64}>Set</DataTable.Header>
          <DataTable.SortingHeader
            active={activeSortingField === 'set'}
            textAlign={'right'}
            fitToContent
            sort={(order) => handleSort('set', order)}
          >
            №
          </DataTable.SortingHeader>
          <DataTable.Header fitToContent>Res.</DataTable.Header>
          <DataTable.Header width={45}></DataTable.Header>
          <DataTable.SortingHeader
            active={activeSortingField === 'name'}
            textAlign={'left'}
            sort={(order) => handleSort('name', order)}
          >
            Name
          </DataTable.SortingHeader>
          {renderHeader()}
        </>
      )}
      renderRow={({ card, meta }) => (
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
          {renderRow({ card, meta })}
        </>
      )}
    />
  )
}

function Full ({
  cards,
  openCardInfo,
  renderHeader = () => null,
  renderRow = () => null,
  renderDetails = () => null,
  renderMenu = () => null
}) {
  return (
    <CardDataTableFull
      data={cards}
      keyExtractor={({ card }) => card.id}
      renderHeader={() => (
        <>
          <DataTable.Header fitToContent>Image</DataTable.Header>
          <DataTable.Header textAlign={'left'}>Details</DataTable.Header>
          {renderHeader()}
        </>
      )}
      renderRow={({ card, meta }) => (
        <>
          <DataTable.Data verticalAlign={'top'}>
            <CardImage
              src={card.image_uris.small}
              alt={card.name}
              set={card.set}
              onClick={() => openCardInfo(card)}
            />
          </DataTable.Data>
          <DataTable.Data>
            <CardDetailsContainer>
              <CardDetailsTable card={card} openCardInfo={openCardInfo} />
              {renderDetails({ card, meta })}
              <DetailsMenu>
                {renderMenu({ card, meta })}
              </DetailsMenu>
            </CardDetailsContainer>
          </DataTable.Data>
          {renderRow({ card, meta })}
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
      '> th': {
        boxSizing: 'border-box'
      },
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
      '> td': {
        boxSizing: 'border-box',
        height: 48
      },
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
  boxSizing: 'border-box',
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
  // border: `1px solid ${rarityBorderColor[rarity]}`,
  // color: (rarity === 'common') ? Colors.borderLight : '#15171B',
  // background: rarityBackground[rarity]
}))

const CardDetailsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  height: '100%',
  minWidth: 400
})

const DetailsMenu = styled('div')({
  display: 'flex',
  gap: 8
})

const CardTable = {
  Compact,
  Full
}

export default CardTable
