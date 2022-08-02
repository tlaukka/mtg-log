import React from 'react'

function useCardCollection () {
  const [cards, setCards] = React.useState({})

  const set = React.useCallback(
    (data) => {
      setCards(data)
    },
    []
  )

  const add = React.useCallback(
    (card, meta) => {
      setCards((value) => ({ ...value, [card.id]: { card, meta } }))
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

  const update = React.useCallback(
    (id, { data = {}, meta = {} }) => {
      const objectToUpdate = cards[id]

      if (objectToUpdate) {
        const updatedObject = {
          ...objectToUpdate,
          ...data,
          meta: {
            ...objectToUpdate.meta,
            ...meta
          }
        }

        setCards((value) => {
          return {
            ...value,
            [id]: updatedObject
          }
        })
      }
    },
    [cards]
  )

  const updateGrade = React.useCallback(
    (id, grade) => {
      update(id, { meta: { grade } })
    },
    [update]
  )

  const updatePrice = React.useCallback(
    (id, price) => {
      update(id, { meta: { price } })
    },
    [update]
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

  function empty () {
    return size() === 0
  }

  function clear () {
    setCards({})
  }

  function toArray () {
    return Object.values(cards)
  }

  return {
    cards,
    set,
    add,
    remove,
    update,
    updateGrade,
    updatePrice,
    get,
    has,
    size,
    empty,
    clear,
    toArray
  }
}

export default useCardCollection
