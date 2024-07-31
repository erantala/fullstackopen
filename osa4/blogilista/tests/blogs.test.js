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
      url: 'https://stackoverflow.com/a/1732454',
      likes: 4397
    }

    const postResponse = await api
      .post('/api/blogs')
      .send(cantParseHtml)
      .expect(201)

    const allBlogs = await api
      .get('/api/blogs')
      .expect(200)

    assert.strictEqual(allBlogs.body.length, blogs.ALL.length + 1)
    const blogTitles = allBlogs.body.map(blog => blog.title)
    assert(blogTitles.includes('You can\'t parse [X]HTML with regex'))
  })

  test('jos kentälle likes ei anneta arvoa, asetetaan sen arvoksi 0', async () => {
    const dummyWithoutLikes = {
      title: 't',
      author: 'a',
      url: 'u'
    }

    const postResponse = await api
      .post('/api/blogs')
      .send(dummyWithoutLikes)
      .expect(201)

    assert.strictEqual(postResponse.body.likes, 0)
  })

  test('lisäys ei mene läpi jos kenttää "title" ei ole annettu', async () => {
    const dummyWithoutTitle = {
      author: 'a',
      url: 'u'
    }

    const failResponse = await api
      .post('/api/blogs')
      .send(dummyWithoutTitle)
      .expect(400)
  })

  test('lisäys ei mene läpi jos kenttää "url" ei ole annettu', async () => {
    const dummyWithoutUrl = {
      title: 't',
      author: 'a'
    }

    const failResponse = await api
      .post('/api/blogs')
      .send(dummyWithoutUrl)
      .expect(400)
  })

  after(async () => {
    await mongoose.connection.close()
    console.log('mongoose connection closed')
  })
})