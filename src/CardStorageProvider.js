import React from 'react'
import { StorageFile } from './storage'
import useCardCollection from './useCardCollection'

const storageFile = new StorageFile('card-collection.json')

export const CardStorageContext = React.createContext()

export function useCardStorage () {
  return React.useContext(CardStorageContext)
}

function CardStorageProvider ({ children }) {
  const cardCollection = useCardCollection()

  const save = React.useCallback(
    (data, options) => {
      function onSuccess (data) {
        cardCollection.set(data)
        options.onSuccess && options.onSuccess(data)
      }

      function onError (error) {
        options.onSuccess && options.onError(error)
      }

      storageFile.save(data, onSuccess, onError)
    },
    [cardCollection]
  )

  React.useEffect(
    () => {
      async function load () {
        const cards = await storageFile.load()
        console.log(cards)
        cardCollection.set(cards)
      }

      load()
    },
    [cardCollection.set]
  )
  // React.useEffect(
  //   () => {
  //     storageFile.save(cardCollection.cards, options?.onSuccess, options?.onError)
  //   },
  //   [cardCollection.cards]
  // )

  return (
    <CardStorageContext.Provider value={{ cardCollection, save }}>
      {children}
    </CardStorageContext.Provider>
  )
}

export default CardStorageProvider
