import React from 'react'

function useEventListeners () {
  const eventListeners = React.useRef(new Map())

  const add = React.useCallback(
    (event, callback) => {
      eventListeners.current.set(event, callback)
    },
    []
  )

  const remove = React.useCallback(
    (event) => {
      eventListeners.current.delete(event)
    },
    []
  )

  const get = React.useCallback(
    (event) => {
      return eventListeners.current.get(event)
    },
    []
  )

  const clear = React.useCallback(
    () => {
      eventListeners.current.clear()
    },
    []
  )

  return React.useMemo(
    () => {
      return {
        add,
        remove,
        get,
        clear
      }
    },
    [add, remove, get, clear]
  )
}

export default useEventListeners
