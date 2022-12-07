import React from 'react'
import useCardCollection from './Hooks/useCardCollection'

export const CardDrawerContext = React.createContext()

export function useCardDrawer () {
  return React.useContext(CardDrawerContext)
}

function CardDrawerProvider ({ children }) {
  const cardDrawer = useCardCollection()

  return (
    <CardDrawerContext.Provider value={cardDrawer}>
      {children}
    </CardDrawerContext.Provider>
  )
}

export default CardDrawerProvider
