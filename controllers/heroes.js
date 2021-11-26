const fs = require('fs').promises
const { promisify } = require('util')
const cloudinary = require('cloudinary').v2
require('dotenv').config()
const {
  getAll,
  createHero,
  updateHeroById,
  removeHeroById,
  updateHeroImage,
} = require('../model/heroes')
const { HttpCode } = require('../helpers/constants')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadCloud = promisify(cloudinary.uploader.upload)

const getAllSuperheroes = async (req, res, next) => {
  try {
    const heroes = await getAll(req.query)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        ...heroes,
      },
    })
  } catch (e) {
    next(e)
  }
}

const createSuperhero = async (req, res, next) => {
  try {
    const hero = await createHero(req.body)
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        hero,
      },
    })
  } catch (e) {
    next(e)
  }
}

const updateSuperhero = async (req, res, next) => {
  try {
    const hero = await updateHeroById(req.params.id, req.body)
    if (hero) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          hero,
        },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: 'Not Found',
      })
    }
  } catch (e) {
    next(e)
  }
}

const deleteAllImages = async (images) => {
  images.forEach(async (img) => {
    const publicId = img.split('/').slice(-3)
    publicId[2] = publicId[2].slice(0, publicId[2].lastIndexOf('.'))
    await cloudinary.uploader.destroy(publicId.join('/'), (err, result) => {
      console.log(err, result)
    })
  })
}

const removeSuperhero = async (req, res, next) => {
  try {
    const hero = await removeHeroById(req.params.id)

    if (hero) {
      let folderPublicId
      if (hero.Images.length > 0) {
        folderPublicId = hero.Images[0].split('/').slice(-3, 2).join('/')
        await deleteAllImages(hero.Images)
      }
      cloudinary.api.delete_folder(folderPublicId, (err, result) => {
        console.log(err, result)
      })
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          hero,
        },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: 'Not Found',
      })
    }
  } catch (e) {
    next(e)
  }
}

const images = async (req, res, next) => {
  try {
    const heroId = req.params.heroId
    const publicId = req.body.prevImagePublicId
    if (!req.file && publicId) {
      await updateHeroImage(heroId)
      await cloudinary.uploader.destroy(publicId, (err, result) => {
        console.log(err, result)
      })
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
      })
    }
    const { secure_url: imageUrl } = await saveAvatarToCloud(req)
    await updateHeroImage(heroId, imageUrl)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        imageUrl,
      },
    })
  } catch (e) {
    next(e)
  }
}

const saveAvatarToCloud = async (req) => {
  const pathFile = req.file.path
  const result = await uploadCloud(pathFile, {
    public_id: `Superheroes/${req.body.heroName}/${req.file.filename
      .split('.')
      .reverse()
      .slice(1)
      .reverse()
      .join('.')}`,
  })
  try {
    req.body.previousImagePublicId &&
      (await cloudinary.uploader.destroy(
        req.body.previousImagePublicId,
        (err, result) => {
          console.log(err, result)
        }
      ))

    await fs.unlink(pathFile)
  } catch (e) {
    console.log(e.message)
  }
  return result
}

module.exports = {
  getAllSuperheroes,
  updateSuperhero,
  createSuperhero,
  removeSuperhero,
  images,
}
