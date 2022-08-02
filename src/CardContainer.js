import React from 'react'
import styled from '@emotion/styled'
import Button from './Button'
import { Route, useRoute } from './RouteProvider'
import CardTable from './CardTable'
import { useCardStorage } from './CardStorageProvider'
import DataTable from './DataTable'

function CardContainer () {
  const { setRoute } = useRoute()
  const cardStorage = useCardStorage()
  console.log(cardStorage)

  return (
    <>
      <Button onClick={() => setRoute(Route.search)}>Search</Button>
      <div>
        <CardTable.Full
          cards={cardStorage.cardCollection.toArray()}
        />
      </div>
    </>
  )
}

function CardTableCompact (props) {
  return (
    <CardTable.Compact
      {...props}
      // renderHeader={() => (
      //   <DataTable.Header fitToContent></DataTable.Header>
      // )}
      // renderRow={({ card }) => (
      //   <DataTable.Data textAlign={'center'}>
      //     {cardDrawer.has(card) ? (
      //       <LinkButton.Danger onClick={() => cardDrawer.remove(card)}>
      //         <Icons.Cross />
      //       </LinkButton.Danger>
      //     ) : (
      //       <LinkButton.Accept onClick={() => cardDrawer.add(card, { grade: Grade.nm })}>
      //         <Icons.Plus />
      //       </LinkButton.Accept>
      //     )}
      //   </DataTable.Data>
      // )}
    />
  )
}

function CardTableFull (props) {
  return (
    <CardTable.Full
      {...props}
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

const CardTableComponent = {
  compact: CardTableCompact,
  details: CardTableFull
}

export default CardContainer
