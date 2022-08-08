import React from 'react'

function useCollection (itemName = 'item') {
  const [collection, setCollection] = React.useState({})

  const set = React.useCallback(
    (data) => {
      setCollection(data)
    },
    []
  )

  const merge = React.useCallback(
    (items) => {
      setCollection((value) => ({
        ...value,
        ...items
      }))
    },
    []
  )

  const add = React.useCallback(
    (item, meta) => {
      setCollection((value) => ({
        ...value,
        [item.id]: {
          [itemName]: item,
          meta
        }
      }))
    },
    [itemName]
  )

  const remove = React.useCallback(
    ({ id }) => {
      setCollection((value) => {
        const { [id]: removed, ...rest } = value
        return rest
      })
    },
    []
  )

  const update = React.useCallback(
    (id, { data = {}, meta = {} }) => {
      const itemToUpdate = collection[id]

      if (itemToUpdate) {
        const updatedItem = {
          ...itemToUpdate,
          ...data,
          meta: {
            ...itemToUpdate.meta,
            ...meta
          }
        }

        setCollection((value) => {
          return {
            ...value,
            [id]: updatedItem
          }
        })
      }
    },
    [collection]
  )

  function get (id) {
    return collection[id]
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
    setCollection({})
  }

  function toArray () {
    return Object.values(collection)
  }

  return {
    collection,
    set,
    merge,
    add,
    remove,
    update,
    get,
    has,
    size,
    empty,
    clear,
    toArray
  }
}

export default useCollection
