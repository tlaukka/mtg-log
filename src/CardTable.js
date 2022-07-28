import styled from '@emotion/styled'
import React from 'react'
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

function CardTable ({ cards, sortCards, openCardInfo }) {
  const { sets } = useCardSets()
  const cardDrawer = useCardDrawer()

  return (
    <CardDataTable
      data={cards}
      renderHeader={() => (
        <>
          <DataTable.Header className={'th-set'}>Set</DataTable.Header>
          <TableSortingHeader className={'th-number'} onClick={() => sortCards('set')}>№</TableSortingHeader>
          <DataTable.Header className={'th-reserved'}>Res.</DataTable.Header>
          <DataTable.Header className={'th-image'}></DataTable.Header>
          <TableSortingHeader className={'th-name'} onClick={() => sortCards('name')}>Name</TableSortingHeader>
          <DataTable.Header className={'th-add'}></DataTable.Header>
        </>
      )}
      renderRow={(card) => (
        <>
          <DataTable.Data className={'td-set'}>
            <CardSet set={sets[card.set]} rarity={card.rarity} />
          </DataTable.Data>
          <DataTable.Data className={'td-number'}>{card.collector_number}</DataTable.Data>
          <DataTable.Data className={'td-reserved'}><ReservedStatus reserved={card.reserved} /></DataTable.Data>
          <DataTable.Data className={'td-image'}><CardPreview card={card} /></DataTable.Data>
          <DataTable.Data className={'td-name'}>
            <CardName onClick={() => openCardInfo(card)}>{card.name}</CardName>
          </DataTable.Data>
          <DataTable.Data className={'td-add'}>
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
    ? <Icons.Check style={{ color: Colors.accept }} />
    : <Icons.Cross style={{ color: Colors.error }}  />
}

function CardPreview ({ card }) {
  return (
    <Popup content={<CardPreviewImage src={card.image_uris.small} alt={card.name} set={card.set} />}>
      <CardPreviewButton><Icons.Camera /></CardPreviewButton>
    </Popup>
  )
}

const CardDataTable = styled(DataTable)({
  th: {
    '&.th-set': {
      width: '1%',
      whiteSpace: 'nowrap',
      paddingLeft: 24
    },
    '&.th-number': {
      textAlign: 'right',
      width: '1%',
      whiteSpace: 'nowrap'
    },
    '&.th-reserved': {
      width: '1%',
      whiteSpace: 'nowrap'
    },
    '&.th-image': {
      width: '1%',
      whiteSpace: 'nowrap'
    },
    '&.th-name': {
      textAlign: 'left'
    },
    '&.th-add': {
      width: '1%',
      whiteSpace: 'nowrap'
    },
    ':last-of-type': {
      paddingRight: 24
    }
  },
  tbody: {
    fontSize: 16,
    'tr:nth-of-type(odd)': {
      backgroundColor: Colors.backgroundAccent
    },
    'tr:first-of-type': {
      height: 12,
    }
  },
  td: {
    '&.td-set': {
      paddingLeft: 24
    },
    '&.td-number': {
      textAlign: 'right',
      color: Colors.control
    },
    '&.td-reserved': {
      textAlign: 'center'
    },
    '&.td-image': {
      padding: 0,
      color: Colors.control
    },
    '&.td-add': {
      textAlign: 'center'
    },
    ':last-of-type': {
      paddingRight: 24
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
  aspectRatio: '488 / 680',
  width: 130
}, ({ set, position }) => {
  const styles = {
    borderRadius: (set === 'lea') ? 10 : 7
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

export default CardTable
