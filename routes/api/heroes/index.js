const express = require('express')
const router = express.Router()
const upload = require('../../../helpers/upload')
const heroesController = require('../../../controllers/heroes')

router
  .get('/', heroesController.getAllSuperheroes)
  .post('/', heroesController.createSuperhero)

router
  .put('/:id', heroesController.updateSuperhero)
  .delete('/:id', heroesController.removeSuperhero)

router.patch('/image/:heroId', upload.single('image'), heroesController.images)

module.exports = router
