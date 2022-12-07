import React from 'react'
import debounce from '../Lib/debounce'

const QUERY_CARD_SETS = 'https://api.scryfall.com/sets'

function useFetchCardSets () {
  const [sets, setSets] = React.useState()
  const [fetching, setFetching] = React.useState(false)
  const [error, setError] = React.useState()

  const fetchCardData = React.useMemo(
    () => {
      return debounce(async () => {
        setFetching(true)
        const response = await fetch(QUERY_CARD_SETS)

        if (response.status !== 200) {
          console.log(`Something went wrong: status ${response.status}`)
          setError(response.status)
          setFetching(false)

          return
        }

        const cardSets = await response.json()
        console.log(cardSets)
        const setsByCode = cardSets.data.reduce((result, entry) => {
          result[entry.code] = entry
          return result
        }, {})

        setSets(setsByCode)
        setFetching(false)
      }, 1000)
    },
    []
  )

  React.useEffect(
    () => {
      fetchCardData()
    },
    [fetchCardData]
  )

  return {
    sets,
    fetching,
    error
  }
}

export default useFetchCardSets
