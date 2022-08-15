import React from 'react'

function usePagination (collection, pageSize = 50) {
  const [page, setPage] = React.useState(1)

  const totalItems = collection.size()
  const totalPages = Math.ceil(totalItems / pageSize)

  function getItems () {
    const start = (page - 1) * pageSize
    const end = page * pageSize

    return collection.toArray().slice(start, end)
  }

  function getNext () {
    if (page < totalPages) {
      return ({ onSuccess } = {}) => {
        setPage((value) => value + 1)
        onSuccess && onSuccess()
      }
    }

    return null
  }

  function getPrevious () {
    if (page > 1) {
      return ({ onSuccess } = {}) => {
        setPage((value) => value - 1)
        onSuccess && onSuccess()
      }
    }

    return null
  }

  return {
    page,
    totalPages,
    items: getItems(),
    totalItems,
    next: getNext(),
    previous: getPrevious()
  }
}

export default usePagination
