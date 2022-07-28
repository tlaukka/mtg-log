import React from 'react'
import useCardCollection from './useCardCollection'

export const CardDrawerContext = React.createContext()

export function useCardDrawer () {
  return React.useContext(CardDrawerContext)
}

export default function CardDrawerProvider ({ children }) {
  const cardDrawer = useCardCollection()

  return (
    <CardDrawerContext.Provider value={cardDrawer}>
      {children}
    </CardDrawerContext.Provider>
  )
}