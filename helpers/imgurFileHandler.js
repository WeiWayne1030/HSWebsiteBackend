const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

const imgurFileHandler = (files) => {
  const images = [files?.avatar?.[0]?.path, files?.image?.[0]?.path]
  const uploadPromises = images.map(file => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null)
      return imgur.uploadFile(file)
        .then(img => {
          resolve(img?.link || null)
        })
        .catch(err => reject(err))
    })
  })
  return Promise.all(uploadPromises)
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}