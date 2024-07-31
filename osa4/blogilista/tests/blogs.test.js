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
  })

  test('blogin id-kenttä on nimeltään "id"', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const firstBlog = response.body[0]
    assert(firstBlog.id)
    assert.strictEqual(firstBlog.id.length, 24)
    assert(firstBlog.id.match(/^[0-9a-f]+$/))
  })

  after(async () => {
    await mongoose.connection.close()
    console.log('mongoose connection closed')
  })
})