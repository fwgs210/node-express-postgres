const app = require('../src/app');
const request = require('supertest')
const { sequelize } = require('../models')

test('GET /api/v1/posts', async () => {

  sequelize
  .authenticate()
  .then(async () => {
    console.log('Connection has been established successfully.');
    const response = await request(app)
    .get('/api/v1/posts')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
  
    expect(response.status).toEqual(200)
    // expect(response.type).toEqual('application/json')
    // expect(response.body.id).toBeDefined()
    // expect(response.body.area_id).toBeDefined()
    // expect(response.body.pickup_date).toBeDefined()
    // expect(response.body.is_garbage).toBeDefined()
    // expect(response.body.is_recycling).toBeDefined()
    // expect(response.body.is_yard_waste).toBeDefined()
    // expect(response.body.is_organic).toBeDefined()
    // expect(response.body.is_christmas_tree).toBeDefined()
    // expect(response.body.is_other).toBeDefined()
    // expect(response.body.is_battery).toBeDefined()
    // expect(response.body.is_exemption).toBeDefined()
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
});