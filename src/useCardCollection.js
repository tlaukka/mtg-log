import React from 'react'

function useCardCollection () {
  const [cards, setCards] = React.useState({})

  const add = React.useCallback(
    (card) => {
      setCards((value) => ({ ...value, [card.id]: card }))
    },
    []
  )

  const remove = React.useCallback(
    ({ id }) => {
      setCards((value) => {
        const { [id]: removed, ...rest } = value
        return rest
      })
    },
    []
  )

  function get (id) {
    return cards[id]
  }

  function has ({ id }) {
    return !!get(id)
  }

  function size () {
    return toArray().length
  }

  function clear () {
    setCards({})
  }

  function toArray () {
    return Object.values(cards)
  }

  return {
    cards,
    add,
    remove,
    get,
    has,
    size,
    clear,
    toArray
  }
}

export default useCardCollection
