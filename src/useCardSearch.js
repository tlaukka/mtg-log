import React from 'react'
import qs from 'qs'
import useQueryStack from './QueryStack'

const PAGE_SIZE = 175

function useCardSearch () {
  const [result, setResult] = React.useState(null)
  const [fetching, setFetching] = React.useState(false)
  const [error, setError] = React.useState(null)

  const queryStack = useQueryStack()

  const fetchCards = React.useCallback(
    async ({ onSuccess, onError } = {}) => {
      setFetching(true)

      const response = await fetch(queryStack.current)
      const json = await response.json()
      console.log(json)

      if (response.status === 200) {
        setResult(json)
        onSuccess && onSuccess()
      } else {
        queryStack.reset()
        setError(response)
        onError && onError()
      }

      setFetching(false)
    },
    [queryStack]
  )

  const searchCards = React.useCallback(
    (search) => {
      const url = `https://api.scryfall.com/cards/search?${qs.stringify({ q: search })}`
      queryStack.push(url)
      fetchCards()
    },
    [queryStack, fetchCards]
  )

  function getNext () {
    if (result?.has_more) {
      return (options) => {
        queryStack.push(result.next_page)
        fetchCards(options)
      }
    }

    return null
  }

  function getPrevious () {
    if (queryStack.size > 1) {
      return (options) => {
        queryStack.pop()
        fetchCards(options)
      }
    }

    return null
  }

  return {
    cards: result?.data || [],
    meta: {
      totalCards: result?.total_cards || null,
      page: queryStack.size,
      totalPages: result?.total_cards ? Math.ceil(result.total_cards / PAGE_SIZE) : null,
    },
    next: getNext(),
    previous: getPrevious(),
    fetching,
    error,
    searchCards
  }
}

export default useCardSearch
