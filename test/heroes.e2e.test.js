const request = require('supertest')
const app = require('../app')
const { hero } = require('../model/__mocks__/data')

jest.mock('../model/heroes.js')

describe('Testing the route api/heroes', () => {
  describe('should handle get request', () => {
    it('should return 200 status for get all heroes', async (done) => {
      const res = await request(app).get('/api/heroes')
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.data.heroes).toBeInstanceOf(Array)
      done()
    })
    it('should return 200 status for id', async (done) => {
      const res = await request(app).get('/api/heroes')
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.data.heroes).toBeInstanceOf(Array)
      done()
    })
  })
  describe('should handle post request', () => {})
  describe('should handle put request', () => {})
  describe('should handle patch request', () => {})
  describe('should handle delete request', () => {})
})
