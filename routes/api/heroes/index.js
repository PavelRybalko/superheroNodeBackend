const express = require('express')
const router = express.Router()
const upload = require('../../../helpers/upload')
const heroesController = require('../../../controllers/heroes')
const validation = require('./validation')

router
  .get('/', heroesController.getAllSuperheroes)
  .post('/', heroesController.createSuperhero)

router
  // .get('/:id', heroesController.getHeroById)
  .put('/:id', heroesController.updateSuperhero)
  // .patch('/:id', heroesController.updateSuperhero)
  .delete('/:id', heroesController.removeSuperhero)

router.patch(
  '/images/:heroId',
  [upload.single('image'), validation.UploadAvatar],
  heroesController.images
)

module.exports = router
