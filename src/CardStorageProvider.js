import { ipcRenderer } from 'electron'
import React from 'react'
import { StorageFile, useStorage } from './storage'
import useCardCollection from './useCardCollection'
import Modal from './Modal'
import styled from '@emotion/styled'
import Colors from './Colors'
import Button from './Button'
import Icons from './Icon'

const storageFile = new StorageFile('card-collection.json')

export const CardStorageContext = React.createContext()

export function useCardStorage () {
  return React.useContext(CardStorageContext)
}

function CardStorageProvider ({ children }) {
  const savePath = React.useRef('')

  const [storageReady, setStorageReady] = React.useState(false)
  const [savePathPromptVisible, setSavePathPromptVisible] = React.useState(false)
  const [savePathError, setSavePathError] = React.useState()

  const storage = useStorage()
  const { cards, set, remove, eventListeners, ...rest } = useCardCollection()

  const load = React.useCallback(
    async ({ onSuccess, onError } = {}) => {
      try {
        const cardStorageSavePath = storage.getValue('cardStorageSavePath')

        if (!cardStorageSavePath) {
          const appPath = await ipcRenderer.invoke('get-app-path')
          savePath.current = `${appPath}/mtg-log-storage`
        } else {
          savePath.current = `${cardStorageSavePath}/mtg-log-storage`
        }

        const result = await storageFile.load(savePath.current)

        set(result)
        setStorageReady(true)
        setSavePathError(null)

        onSuccess && onSuccess(result)
      } catch (error) {
        if (error.code === 'ENOENT') {
          setSavePathError(error)
          setSavePathPromptVisible(true)
        }

        onError && onError(error)
      }
    },
    [set, storage]
  )

  const save = React.useCallback(
    async (data, { onSuccess, onError } = {}) => {
      try {
        const entry = {
          ...cards,
          ...data
        }

        await storageFile.backup(savePath.current)

        const result = await storageFile.save(savePath.current, entry)
        console.log(result)
        set(result)

        onSuccess && onSuccess(result)
      } catch (error) {
        onError && onError(error)
      }
    },
    [cards, set]
  )

  const removeCard = React.useCallback(
    async (card, { onSuccess, onError } = {}) => {
      try {
        const { [card.id]: removed, ...entry } = cards
        const result = await storageFile.save(savePath.current, entry, onSuccess, onError)
        set(result)

        onSuccess && onSuccess(result)
      } catch (error) {
        onError && onError(error)
      }
    },
    [cards, set]
  )

  React.useEffect(
    () => {
      load()
    },
    [load]
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

  async function showOpenDialog () {
    try {
      const result = await ipcRenderer.invoke('show-open-dialog', { properties: ['openDirectory'] })

      if (!result.canceled) {
        storage.setValue('cardStorageSavePath', result.filePaths[0])

        await load()
        setSavePathPromptVisible(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const value = {
    storageReady,
    save,
    removeCard,
    set,
    eventListeners,
    ...rest
  }

  return (
    <CardStorageContext.Provider value={value}>
      <Modal visible={savePathPromptVisible} onClose={() => setSavePathPromptVisible(false)}>
        <Wrapper>
          <ErrorMessageContainer>
            <ErrorMessage>Invalid storage file path:</ErrorMessage>
            <ErrorMessage>{savePathError?.path}</ErrorMessage>
          </ErrorMessageContainer>
          <SetPathButton onClick={showOpenDialog}>
            <Icons.Open />
            Locate storage file folder
          </SetPathButton>
        </Wrapper>
      </Modal>
      {children}
    </CardStorageContext.Provider>
  )
}

const Wrapper = styled('div')({
  width: '100%',
  height: '80vh',
  border: '1px solid gray'
})

const ErrorMessageContainer = styled('div')({
  margin: '32px 0'
})

const ErrorMessage = styled('div')({
  textAlign: 'center',
  marginBottom: 2,
  color: Colors.error
})

const SetPathButton = styled(Button)({
  display: 'block',
  fontSize: 24,
  height: 64,
  margin: '0 auto',
  padding: '0 48px',
  border: `2px solid ${Colors.control}`,
  backgroundColor: 'transparent'
})

export default CardStorageProvider
