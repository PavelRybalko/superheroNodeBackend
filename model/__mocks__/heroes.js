const {hero, heroes} = require('./data')
 
const getAll = jest.fn(({
  // sortBy,
  // sortByDesc,
  // filter,
  limit = '5',
  offset = '0',
  // page = '1',
}) => {
   return { heroes, total: heroes.length, limit, offset }
})

const createHero = jest.fn((body) => {
 const newHero = {...body, _id: '5sjdhdskdsfj44jdfdg'};
 heroes.push(newHero)
 return newHero
})

const updateHeroById = jest.fn((id, body) => {
  const hero = heroes.filter(el=>String(el._id)=== String(id))
  if(hero){
    hero = {...hero, body}
  }
  return hero
})

const removeHeroById = jest.fn((id) => {
  const index = heroes.findIndex((el)=> String(el._id) === String(id))
  if(index === -1){
    return null
  } 
  const [hero] = heroes.splice(index,1)
  return hero
})

const updateHeroByField = async (field, updateData) => {
  
}

const updateHeroImage = async (id, avatarURL, avatarIdCloud) => {
 return {}
}

module.exports = {
  getAll,
  createHero,
  updateHeroById,
  removeHeroById,
  updateHeroByField
  updateHeroImage,
}
