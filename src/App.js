import React from 'react'
import styled from '@emotion/styled'
import Colors from './Colors'
import SearchContainer from './SearchContainer'
import CardContainer from './CardContainer'
import { Route, useRoute } from './RouteProvider'

import 'keyrune/css/keyrune.css'

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
  // height: '100%',
  color: Colors.foregroundLight
})

const Card = styled('img')({
  height: 456
})

export default App
