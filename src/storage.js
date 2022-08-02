import React from 'react'
import fs from 'fs'

const STORAGE_FILE = 'storage.json'

function readFile (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
        return reject(error)
      }

      resolve(JSON.parse(data))
    })
  })
}

function writeFile (path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), 'utf8', (error) => {
      if (error) {
        return reject(error)
      }

      resolve(data)
    })
  })
}

export class StorageFile {
  constructor (fileName) {
    this.fileName = fileName
  }

  async save (data, onSuccess, onError) {
    return save(this.fileName, data, onSuccess, onError)
  }

  async load (onSuccess, onError) {
    return load(this.fileName, onSuccess, onError)
  }
}

async function load (fileName, onSuccess, onError) {
  try {
    const result = await readFile(fileName)
    onSuccess && onSuccess(result)

    return result
  } catch (error) {
    console.log(error)
    onError && onError(error)

    if (error.code === 'ENOENT') {
      // Create an empty storage file if it doesn't exist
      await writeFile(fileName, {})
      const data = await this.load()

      return data
    }
  }
}

async function save (fileName, data, onSuccess, onError) {
  try {
    const result = await writeFile(fileName, data)
    onSuccess && onSuccess(result)
  } catch (error) {
    console.log(error)
    onError && onError(error)
  }
}

export const StorageContext = React.createContext()

export function useStorage () {
  return React.useContext(StorageContext)
}

export default function StorageProvider ({ children }) {
  const [storageReady, setStorageReady] = React.useState(false)
  const [storage, setStorage] = React.useState()

  function getValue (key) {
    return storage?.[key]
  }

  function getValues () {
    return storage
  }

  function setValue (key, value) {
    setStorage((prevState) => ({
      ...prevState,
      [key]: value
    }))
  }

  React.useEffect(
    () => {
      async function saveStorage () {
        if (storage) {
          save(STORAGE_FILE, storage)
        }
      }

      saveStorage()
    },
    [storage]
  )

  React.useEffect(
    () => {
      async function loadStorage () {
        const data = await load(STORAGE_FILE)

        setStorageReady(true)
        setStorage(data)
      }

      loadStorage()
    },
    []
  )

  if (!storageReady) {
    return null
  }

  return (
    <StorageContext.Provider value={{ getValue, getValues, setValue }}>
      {children}
    </StorageContext.Provider>
  )
}
