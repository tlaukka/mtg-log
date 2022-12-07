import React from 'react'
import file from './file'

const STORAGE_FILE = 'storage.json'

export class StorageFile {
  constructor (fileName) {
    this.fileName = fileName
  }

  init = async (path) => {
    try {
      await file.mkdir(path)
      return await this.save(path, {})
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  save = async (path, data) => {
    try {
      const result = await file.write(`${path}/${this.fileName}`, data)
      return result
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  load = async (path) => {
    try {
      console.log(`Loading: ${path}/${this.fileName}`)
      const result = await file.read(`${path}/${this.fileName}`)
      return result
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  backup = async (path) => {
    try {
      return await file.copy(`${path}/${this.fileName}`, `${path}/backup-${this.fileName}`)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  loadBackup = async (path) => {
    try {
      await file.copy(`${path}/backup-${this.fileName}`, `${path}/${this.fileName}`)
      return await file.read(path)
    } catch (error) {
      throw error
    }
  }

  changeLocation = async (prevPath, newPath) => {
    try {
      await file.cpdir(prevPath, newPath)
      file.rmdir(prevPath)

      return await file.read(`${newPath}/${this.fileName}`)
    } catch (error) {
      throw error
    }
  }
}

class Storage {
  constructor () {
    this.data = {}
  }

  getValue = (key) => {
    return this.data[key]
  }

  getValues = () => {
    return this.data
  }

  setValue = (key, value) => {
    this.data = {
      ...this.data,
      [key]: value
    }

    this.save()
  }

  save = async () => {
    return file.write(STORAGE_FILE, this.data)
  }

  load = async () => {
    const data = await file.read(STORAGE_FILE)
    this.data = data
  }
}

export const StorageContext = React.createContext()

export function useStorage () {
  return React.useContext(StorageContext)
}

export default function StorageProvider ({ children }) {
  const [storageReady, setStorageReady] = React.useState(false)

  const storage = React.useMemo(() => new Storage(), [])

  React.useEffect(
    () => {
      async function loadStorage () {
        try {
          await storage.load(STORAGE_FILE)
          setStorageReady(true)
        } catch (error) {
          if (error.code === 'ENOENT') {
            await file.write(STORAGE_FILE, {})
            loadStorage()
          }
        }
      }

      loadStorage()
    },
    [storage]
  )

  const value = React.useMemo(
    () => {
      return {
        getValue: storage.getValue,
        getValues: storage.getValues,
        setValue: storage.setValue
      }
    },
    [storage]
  )

  if (!storageReady) {
    return null
  }

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  )
}
