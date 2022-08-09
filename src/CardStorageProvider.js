import React from 'react'
import { StorageFile } from './storage'
import useCardCollection from './useCardCollection'

const storageFile = new StorageFile('card-collection.json')

export const CardStorageContext = React.createContext()

export function useCardStorage () {
  return React.useContext(CardStorageContext)
}

function CardStorageProvider ({ children }) {
  const [storageReady, setStorageReady] = React.useState(false)

  const { cards, set, merge, eventListeners, ...rest } = useCardCollection()

  const save = React.useCallback(
    (data, options) => {
      function onSuccess (data) {
        merge(data)
        options.onSuccess && options.onSuccess(data)
      }

      function onError (error) {
        options.onSuccess && options.onError(error)
      }

      const entry = {
        ...cards,
        ...data
      }

      storageFile.save(entry, onSuccess, onError)
    },
    [cards, merge]
  )

  React.useEffect(
    () => {
      async function load () {
        const cards = await storageFile.load()
        // console.log(cards)
        console.log('--------- LOAD --------')
        set(cards)
        setStorageReady(true)
      }

      load()
    },
    [set]
  )

  // React.useEffect(
  //   () => {
  //     function handleSuccess (data) {
  //       console.log('---- save success! ----')
  //       eventListeners.get('save-success')?.(data)
  //     }

  //     function handleError (error) {
  //       console.log(error)
  //       eventListeners.get('save-error')?.(error)
  //     }

  //     if (storageReady) {
  //       storageFile.save(cards, handleSuccess, handleError)
  //     }
  //   },
  //   [storageReady, cards, eventListeners]
  // )

  const value = {
    storageReady,
    save,
    set,
    merge,
    eventListeners,
    ...rest
  }

  return (
    <CardStorageContext.Provider value={value}>
      {children}
    </CardStorageContext.Provider>
  )
}

export default CardStorageProvider
