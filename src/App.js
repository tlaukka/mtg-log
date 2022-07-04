import React from 'react'
import styled from '@emotion/styled'
import Colors from './Colors'
import SearchContainer from './SearchContainer'
import CardContainer from './CardContainer'
import { Route, useRoute } from './RouteProvider'
import useCardSets from './useCardSets'

function useRandomCard () {
  const [card, setCard] = React.useState(null)
  const [isLoading, setLoading] = React.useState(false)

  async function fetchRandomCard () {
    const query = 'https://api.scryfall.com/cards/random'

    setLoading(true)
    const response = await fetch(query)
    setLoading(false)

    const data = await response.json()
    console.log(data)
    setCard(data)
  }

  return {
    card,
    isLoading,
    fetchRandomCard
  }
}

function App() {
  const { route } = useRoute()
  const { sets } = useCardSets()

  return (
    <MainContainer>
      {(route === Route.search) && <SearchContainer sets={sets} />}
      {(route === Route.list) && <CardContainer sets={sets} />}
    </MainContainer>
  )
}

const MainContainer = styled('div')({
  position: 'relative',
  height: '100%',
  color: Colors.foregroundLight
})

const Card = styled('img')({
  height: 456
})

export default App
