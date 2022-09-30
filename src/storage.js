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
    console.log({path, data})
    fs.writeFile(path, JSON.stringify(data), 'utf8', (error) => {
      if (error) {
        return reject(error)
      }

      resolve(data)
    })
  })
}

function copyFile (src, dest) {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, (error) => {
      if (error) {
        return reject(error)
      }

      resolve()
    })
  })
}

function mkdir (path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true },  (error) => {
      if (error) {
        return reject(error)
      }

      resolve(path)
    })
  })
}

function rmdir (path) {
  return new Promise((resolve, reject) => {
    fs.rm(path, { recursive: true },  (error) => {
      if (error) {
        return reject(error)
      }

      resolve(path)
    })
  })
}

function cpdir (src, dest) {
  return new Promise((resolve, reject) => {
    fs.cp(src, dest, { recursive: true }, (error) => {
      if (error) {
        return reject(error)
      }

      resolve()
    })
  })
}

export class StorageFile {
  constructor (fileName) {
    this.fileName = fileName
  }

  // async setSavePath (path) {
  //   try {
  //     const previousPath = await this.getPath()

  //     this.savePath = path
  //     const newSavePath = await this.getPath()

  //     await mkdir(newSavePath)

  //     console.log({
  //       src: `${previousPath}/${this.fileName}`,
  //       dest: `${newSavePath}/${this.fileName}`
  //     })

  //     return copyFile(`${previousPath}/${this.fileName}`, `${newSavePath}/${this.fileName}`)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  init = async (path) => {
    try {
      await mkdir(path)
      return await this.save(path, {})
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  save = async (path, data) => {
    try {
      const result = await save(`${path}/${this.fileName}`, data)
      return result
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  load = async (path) => {
    try {
      console.log(`Loading: ${path}/${this.fileName}`)
      const result = await load(`${path}/${this.fileName}`)
      return result
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  backup = async (path) => {
    try {
      return await copyFile(`${path}/${this.fileName}`, `${path}/backup-${this.fileName}`)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  loadBackup = async (path) => {
    try {
      await copyFile(`${path}/backup-${this.fileName}`, `${path}/${this.fileName}`)
      return await load(path)
    } catch (error) {
      throw error
    }
  }

  changeLocation = async (prevPath, newPath) => {
    try {
      await cpdir(prevPath, newPath)
      rmdir(prevPath)

      return await load(`${newPath}/${this.fileName}`)
    } catch (error) {
      throw error
    }
  }
}

async function load (fileName) {
  try {
    return await readFile(fileName)
  } catch (error) {
    throw error
  }
}

async function save (fileName, data) {
  try {
    return await writeFile(fileName, data)
  } catch (error) {
    throw error
  }
}

export const StorageContext = React.createContext()

export function useStorage () {
  return React.useContext(StorageContext)
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
    return save(STORAGE_FILE, this.data)
  }

  load = async () => {
    const data = await load(STORAGE_FILE)
    this.data = data
  }
}

export default function StorageProvider ({ children }) {
  // const storage = React.useRef(new Storage())

  const [storageReady, setStorageReady] = React.useState(false)

  const storage = React.useMemo(() => new Storage(), [])

  // const [storage, setStorage] = React.useState()

  // function getValue (key) {
  //   return storage?.[key]
  // }

  // function getValues () {
  //   return storage
  // }

  // function setValue (key, value) {
  //   setStorage((prevState) => ({
  //     ...prevState,
  //     [key]: value
  //   }))
  // }

  // React.useEffect(
  //   () => {
  //     async function saveStorage () {
  //       if (storage) {
  //         save(STORAGE_FILE, storage)
  //       }
  //     }

  //     saveStorage()
  //   },
  //   [storage]
  // )

  // React.useEffect(
  //   () => {
  //     async function loadStorage () {
  //       const data = await load(STORAGE_FILE)

  //       setStorageReady(true)
  //       setStorage(data)
  //     }

  //     loadStorage()
  //   },
  //   []
  // )

  React.useEffect(
    () => {
      async function loadStorage () {
        try {
          await storage.load(STORAGE_FILE)
          setStorageReady(true)
        } catch (error) {
          if (error.code === 'ENOENT') {
            await writeFile(STORAGE_FILE, {})
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
    // <StorageContext.Provider value={{ getValue, getValues, setValue }}>
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  )
}
