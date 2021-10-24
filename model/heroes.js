const Superhero = require('./schemas/superhero')

const getAll = async ({
  // sortBy,
  // sortByDesc,
  // filter,
  limit = '5',
  offset = '0',
  // page = '1',
}) => {
  const results = await Superhero.paginate('', {
    limit,
    // sort: {
    //   ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
    //   ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    // },
    offset,
    // select: filter ? filter.split('|').join(' ') : ' ',
  })

  const { docs: heroes, totalDocs: total } = results
  return { total: total.toString(), limit, offset, heroes }
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

const updateHeroImage = async (id, Images) => {
  return await Superhero.updateOne(
    { _id: id },
    { $addToSet: { Images } },
    { new: true }
  )
}

module.exports = {
  getAll,
  createHero,
  updateHeroById,
  removeHeroById,
  updateHeroByField,
  updateHeroImage,
}
