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

  test('kantaan voi lisätä blogeja', async () => {
    const cantParseHtml = {
      title: 'You can\'t parse [X]HTML with regex',
      author: 'bobince',
      url: 'https://stackoverflow.com/a/1732454'
    }

    const newBlog = new Blog(cantParseHtml)
    await newBlog.save()

    const allBlogs = await Blog.find({})
    assert.strictEqual(allBlogs.length, blogs.ALL.length + 1)
    const blogTitles = allBlogs.map(blog => blog.title)
    assert(blogTitles.includes('You can\'t parse [X]HTML with regex'))
  })

  after(async () => {
    await mongoose.connection.close()
    console.log('mongoose connection closed')
  })
})