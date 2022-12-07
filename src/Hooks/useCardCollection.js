import React from 'react'
import useCollection from './useCollection'
import useEventListeners from './useEventListeners'

function useCardCollection () {
  const eventListeners = useEventListeners()
  const { collection, update, ...rest } = useCollection('card')

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

  return {
    cards: collection,
    updateGrade,
    updatePrice,
    eventListeners,
    ...rest
  }
}

export default useCardCollection
