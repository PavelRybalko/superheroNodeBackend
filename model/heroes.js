const Superhero = require('./schemas/superhero')

const getAll = async ({ query = '', limit = '5', page = '1' }) => {
  const regex = new RegExp(query, 'i')
  const results = await Superhero.paginate(
    { nickname: { $regex: regex } },
    {
      limit,
      page,
    }
  )

  const { docs: heroes, totalDocs: total } = results
  return { total: total.toString(), limit, page, heroes }
}

const createHero = async (body) => {
  const superhero = new Superhero(body)
  return await superhero.save()
}

const updateHeroById = async (id, body) => {
  return await Superhero.findByIdAndUpdate(id, { ...body }, { new: true })
}

const removeHeroById = async (id) => {
  return await Superhero.findByIdAndRemove(id)
}

const updateHeroByField = async (field, updateData) => {
  return await Superhero.findOneAndUpdate(field, updateData, { new: true })
}

const updateHeroImage = async (id, image) => {
  const Images = !image ? [] : [image]
  return await Superhero.updateOne({ _id: id }, { Images }, { new: true })
}

module.exports = {
  getAll,
  createHero,
  updateHeroById,
  removeHeroById,
  updateHeroByField,
  updateHeroImage,
}
