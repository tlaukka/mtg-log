import React from 'react'
import styled from '@emotion/styled'
import Colors from './Colors'
import SearchContainer from './SearchContainer'
import CardDrawerProvider from './CardDrawerProvider'
import CardSearchProvider from './CardSearchProvider'

import 'keyrune/css/keyrune.css'
import 'mana-font/css/mana.css'
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css'

function App() {
  return (
    <MainContainer>
      <CardDrawerProvider>
        <CardSearchProvider>
          <SearchContainer />
        </CardSearchProvider>
      </CardDrawerProvider>
    </MainContainer>
  )
}

const MainContainer = styled('div')({
  position: 'relative',
  color: Colors.foregroundLight
})

export default App
