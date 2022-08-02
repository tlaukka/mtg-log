import React from 'react'
import styled from '@emotion/styled'
import Colors from './Colors'
import SearchContainer from './SearchContainer'
// import CardContainer from './CardContainer'
// import { Route, useRoute } from './RouteProvider'

import 'keyrune/css/keyrune.css'
import 'mana-font/css/mana.css'
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css'
import CardDrawerProvider from './CardDrawerProvider'

function App() {
  // const { route } = useRoute()

  // return (
  //   <MainContainer>
  //     {(route === Route.search) && (
  //       <CardDrawerProvider>
  //         <SearchContainer />
  //       </CardDrawerProvider>
  //     )}
  //     {(route === Route.list) && <CardContainer />}
  //   </MainContainer>
  // )
  return (
    <MainContainer>
      <CardDrawerProvider>
        <SearchContainer />
      </CardDrawerProvider>
    </MainContainer>
  )
}

const MainContainer = styled('div')({
  position: 'relative',
  color: Colors.foregroundLight
})

export default App
