import React from 'react'
import useFetchCardSets from './useFetchCardSets'

export const CardSetContext = React.createContext()

export function useCardSets () {
  return React.useContext(CardSetContext)
}

export default function CardSetProvider ({ children }) {
  const value = useFetchCardSets()

  return (
    <CardSetContext.Provider value={value}>
      {children}
    </CardSetContext.Provider>
  )
}
