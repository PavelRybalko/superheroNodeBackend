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
  // updateHeroByField,
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

const removeSuperhero = async (req, res, next) => {
  try {
    const hero = await removeHeroById(req.params.id)
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

const images = async (req, res, next) => {
  try {
    const heroId = req.params.heroId
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
    public_id: req.file.originalname
      .split('.')
      .reverse()
      .slice(1)
      .reverse()
      .join('.'),
    folder: 'Superheroes',
  })
  // cloudinary.uploader.destroy(req.hero.ImagesIdCloud, (err, result) => {
  //   console.log(err, result)
  // })
  try {
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
