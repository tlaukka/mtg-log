import fs from 'fs'

const file = {}

file.read = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
        return reject(error)
      }

      resolve(JSON.parse(data))
    })
  })
}

file.write = (path, data) => {
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

file.copy = (src, dest) => {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, (error) => {
      if (error) {
        return reject(error)
      }

      resolve()
    })
  })
}

file.mkdir = (path) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true },  (error) => {
      if (error) {
        return reject(error)
      }

      resolve(path)
    })
  })
}

file.rmdir = (path) => {
  return new Promise((resolve, reject) => {
    fs.rm(path, { recursive: true },  (error) => {
      if (error) {
        return reject(error)
      }

      resolve(path)
    })
  })
}

file.cpdir = (src, dest) => {
  return new Promise((resolve, reject) => {
    fs.cp(src, dest, { recursive: true }, (error) => {
      if (error) {
        return reject(error)
      }

      resolve()
    })
  })
}

export default file
