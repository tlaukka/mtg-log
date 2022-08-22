import React from 'react'
import useCardSearchQuery from './useCardSearchQuery'
import useCollection from './useCollection'

export const CardSearchContext = React.createContext()

export function useCardSearch () {
  return React.useContext(CardSearchContext)
}

function CardSearchProvider ({ children }) {
  const collection = useCollection('card')

  const { cards, ...restSearch } = useCardSearchQuery()

  // const handleSearch = React.useCallback(
  //   (search, options) => {
  //     searchCards(search, options)
  //   },
  //   [searchCards]
  // )

  React.useEffect(
    () => {
      collection.set(cards)
    },
    [collection, cards]
  )

  const value = {
    cards: collection,
    ...restSearch
  }

  return (
    <CardSearchContext.Provider value={value}>
      {children}
    </CardSearchContext.Provider>
  )
}

export default CardSearchProvider
