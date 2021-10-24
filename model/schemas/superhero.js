const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const superheroSchema = new Schema(
  {
    nickname: {
      type: String,
      required: [true, 'Set nickname for Hero!'],
      unique: true,
    },
    real_name: {
      type: String,
      required: [true, 'Set kname for Hero!'],
      unique: true,
    },
    origin_description: {
      type: String,
      default: null,
    },
    superpowers: {
      type: String,
    },
    catch_phrase: {
      type: String,
      default: null,
    },
    Images: {
      type: Array,
      set: (data) => (!data ? [] : data),
    },
    // ImagesIdCloud: {
    //   type: Array,
    //   set: (data) => (!data ? [] : data),
    // },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

superheroSchema.plugin(mongoosePaginate)
const Superhero = model('superheroe', superheroSchema)

module.exports = Superhero
