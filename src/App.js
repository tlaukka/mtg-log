import React from 'react'
import styled from '@emotion/styled'
import Colors from './Colors'
import SearchContainer from './SearchContainer'
import CardContainer from './CardContainer'
import { Route, useRoute } from './RouteProvider'

import 'keyrune/css/keyrune.css'
import 'mana-font/css/mana.css'

function App() {
  const { route } = useRoute()

  return (
    <MainContainer>
      {(route === Route.search) && <SearchContainer />}
      {(route === Route.list) && <CardContainer />}
    </MainContainer>
  )
}

const MainContainer = styled('div')({
  position: 'relative',
  color: Colors.foregroundLight
})

export default App
