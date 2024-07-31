const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const blogs = require('./blogs_for_test')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs.ALL)
})

describe('blogilistan testit', () => {
  test('happy path palauttaa kaikki blogit', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, blogs.ALL.length)

    console.log('happy path test passed')
  })

  after(async () => {
    console.log('closing mongoose connection')
    await mongoose.connection.close()
    console.log('mongoose connection closed')
  })
})