import React from 'react'
import qs from 'qs'

function useCardNameSearch () {
  const [card, setCard] = React.useState(null)
  const [fetching, setFetching] = React.useState(false)
  const [error, setError] = React.useState(null)

  const searchCard = React.useCallback(
    async (search, { onSuccess, onError } = {}) => {
      setFetching(true)

      const response = await fetch(`https://api.scryfall.com/cards/named?${qs.stringify(search)}`)
      const json = await response.json()
      console.log(json)

      if (response.status === 200) {
        setCard(json)
        onSuccess && onSuccess(json)
      } else {
        setError(json)
        onError && onError(json)
      }

      setFetching(false)
    },
    []
  )

  return {
    card,
    fetching,
    error,
    searchCard
  }
}

export default useCardNameSearch
