const app = require('../src/app');
const request = require('supertest')
const { connectDB } = require('../jest-setup')

connectDB()

test('GET /api/v1/posts', async (done) => {
    const response = await request(app)
    .get('/api/v1/posts')
    .expect('Content-Type', /json/)
  
    expect(response.status).toEqual(200)
    done()

})

test('POST /api/v1/user/login', async (done) => {
    const response = await request(app)
        .post('/api/v1/user/login')
        .send({username: 'fwgs210', password: '87532998'})
        .expect('Content-Type', /json/)

        expect(response.status).toEqual(200)
        done()
})