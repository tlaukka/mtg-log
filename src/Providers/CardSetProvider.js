import styled from '@emotion/styled'
import React from 'react'
import Colors from '../Colors'
import constants from '../constants'
import useFetchCardSets from '../Hooks/useFetchCardSets'

export const CardSetContext = React.createContext()

export function useCardSets () {
  return React.useContext(CardSetContext)
}

function CardSetProvider ({ children }) {
  const value = useFetchCardSets()

  return (
    <CardSetContext.Provider value={value}>
      {(!value.sets) ? (
        <LoadingContainer>
          <Loader>Loading...</Loader>
          <FooterPlaceholder />
        </LoadingContainer>
      ) : (
        children
      )}
    </CardSetContext.Provider>
  )
}

const LoadingContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%'
})

const Loader = styled('div')({
  fontSize: 32,
  fontWeight: '400',
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  paddingBottom: '10%',
  color: Colors.control
})

const FooterPlaceholder = styled('div')({
  width: '100%',
  height: constants.FOOTER_HEIGHT,
  backgroundColor: Colors.backgroundDark
})

export default CardSetProvider
