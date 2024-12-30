const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

const INITIAL_USERNAME = 'erkkiesi'

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasanana:ananasalas', 10)
    const user = new User({ username: INITIAL_USERNAME, passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const newUser = {
      username: 'testicle',
      name: 'Katto Kassinen',
      password: 'ersal'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newUserFromDb = await User.findOne({ username: newUser.username })
    assert.strictEqual(newUserFromDb.username, newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const newUser = {
      username: INITIAL_USERNAME,
      name: 'Superuser',
      password: 'siikrit'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.equal(result.body.error,'expected `username` to be unique')
  })

  test('creation fails with proper statuscode and message if password missing', async () => {
    const newUser = {
      username: 'nopasswd',
      name: 'Mr Passwordless'
    }

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    assert.equal(result.body.error,'Password is required')
  })

  test('creation fails with proper statuscode and message if password too short', async () => {
    const newUser = {
      username: 'shortpasswd',
      name: 'Mr Short Password',
      password: 'pw'
    }

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    assert.equal(result.body.error,'Password must contain at least 3 characters')
  })

  after(async () => {
    await mongoose.connection.close()
  })
})