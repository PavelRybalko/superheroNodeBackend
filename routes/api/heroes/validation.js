const Joi = require('joi')
const { HttpCode } = require('../../../helpers/constants')

const schemaUpdateHero = Joi.object({
  name: Joi.string().min(3).required(),
}).min(1)

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: 400,
      message: `Field ${message.replace(/"/g, '')}`,
    })
  }
  next()
}

module.exports.UpdateHero = (req, res, next) => {
  return validate(schemaUpdateHero, req.body, next)
}

module.exports.UploadAvatar = (req, res, next) => {
  if (!req.file) {
    next(
      res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Field imageURL with file is not found',
      })
    )
  }
  next()
}
