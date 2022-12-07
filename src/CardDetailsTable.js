import styled from '@emotion/styled'
import React from 'react'
import { useCardSets } from './Providers/CardSetProvider'
import CardSetSymbol from './CardSetSymbol'
import Colors from './Colors'
import Rarity from './Rarity'
import ReservedStatus from './ReservedStatus'

function CardDetailsTable ({ card, openCardInfo, ...rest }) {
  const { sets } = useCardSets()

  const onNameClick = openCardInfo ? () => openCardInfo(card) : null

  return (
    <CardDetailsDataTable {...rest}>
      <thead>
        <tr><th /><th /></tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <CardHeader>
              <span>№ {card?.collector_number || '-'}/<span>{sets[card.set].card_count || '-'}</span></span>
            </CardHeader>
          </td>
          <td>
            <CardHeader onClick={onNameClick}>
              {card?.name || '[Card name]'}
            </CardHeader>
          </td>
        </tr>
        <TableRowSpacer><td /><td /></TableRowSpacer>
        <tr>
          <td rowSpan={2}>
            <CardSetSymbol code={card.set} size={41} fixedWidth={false} />
          </td>
          <td>{sets[card.set].name || '[Card set]'}</td>
        </tr>
        <tr>
          <td>
            {card ? (
              `Released - ${new Date(sets[card.set].released_at).getFullYear()}`
            ) : (
              '[Release year]'
            )}
          </td>
        </tr>
        <TableRowSpacer><td /><td /></TableRowSpacer>
        <tr>
          <td>Rarity:</td>
          <td><Rarity rarity={card?.rarity} /></td>
        </tr>
        <tr>
          <td>Reserved:</td>
          <td>
            <ReservedStatus reserved={card.reserved} />
          </td>
        </tr>
      </tbody>
    </CardDetailsDataTable>
  )
}

export const CardDetailsDataTable = styled('table')({
  width: '100%',
  height: 1,
  borderCollapse: 'collapse',
  color: Colors.control,
  '> thead': {
    '> tr': {
      '> th': {
        padding: 0,
      },
      '> th:nth-of-type(1)': {
        width: 120
      }
    }
  },
  '> tbody': {
    '> tr': {
      '> td': {
        maxWidth: 0,
        // overflow: 'hidden',
        // textOverflow: 'ellipsis',
        // whiteSpace: 'nowrap',
        padding: '0 0 4px 0'
      }
    }
  }
})

const TableRowSpacer = styled('tr')({
  height: 12
})

const CardHeader = styled('h1')({
  fontSize: 20,
  // overflow: 'hidden',
  // whiteSpace: 'nowrap',
  // textOverflow: 'ellipsis',
  display: 'inline-flex',
  margin: 0,
  color: Colors.foregroundLight,
  span: {
    marginRight: 8,
    color: Colors.control,
    span: {
      fontSize: 12
    }
  }
}, ({ onClick }) => ({
  cursor: onClick ? 'pointer' : 'text',
  ':hover': {
    color: onClick ? Colors.accept : Colors.foregroundLight
  }
}))

export default CardDetailsTable
