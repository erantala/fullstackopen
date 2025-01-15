const {describe, test, beforeEach, after} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const blogs = require('./blogs_for_test')

const api = supertest(app)

const TEST_USERNAME = 'erkkie'
let TEST_USER_TOKEN = null

beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({username: TEST_USERNAME, passwordHash: '#dummy-hash#'})
    const savedUser = await user.save()
    const userForToken = {
        username: TEST_USERNAME,
        id: savedUser._id
    }
    TEST_USER_TOKEN = jwt.sign(
        userForToken,
        process.env.SECRET)

    await Blog.deleteMany({})
    await Blog.insertMany(blogs.ALL.map(blog => ({...blog, user: savedUser._id})))
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

    describe('blogin lisäys', () => {
        test('kantaan voi lisätä blogeja', async () => {
            const cantParseHtml = {
                title: 'You can\'t parse [X]HTML with regex',
                author: 'bobince',
                url: 'https://stackoverflow.com/a/1732454',
                likes: 4397
            }

            const postResponse = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${TEST_USER_TOKEN}`)
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
                .set('Authorization', `Bearer ${TEST_USER_TOKEN}`)
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
                .set('Authorization', `Bearer ${TEST_USER_TOKEN}`)
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
                .set('Authorization', `Bearer ${TEST_USER_TOKEN}`)
                .send(dummyWithoutUrl)
                .expect(400)
        })

        test('lisäys ei mene läpi jos käyttäjän tokenia ei ole annettu', async () => {
            const dummyBlog = {
                title: 't',
                author: 'a',
                url: 'u'
            }

            const failResponse = await api
                .post('/api/blogs')
                .send(dummyBlog)
                .expect(401)
            assert.strictEqual(failResponse.body.error, "token required")
        })
    })

    describe('blogin poisto', () => {
        test('yksittäisen blogin poisto onnistuu', async () => {
            const deleteResponse = await api
                .delete(`/api/blogs/${blogs.firstClassTests._id}`)
                .set('Authorization', `Bearer ${TEST_USER_TOKEN}`)
                .expect(204)

            const notFoundAnymore = await Blog.findById(blogs.firstClassTests._id)
            assert(!notFoundAnymore)
        })

        test('toisen käyttäjän blogin poisto ei onnistu',{ concurrency: false }, async () => {
            const user = new User({username: 'badHacker', passwordHash: '#dummy-hash#'})
            const savedUser = await user.save()
            const wrongUserIdToken = jwt.sign(
                {username: 'badHacker', id: savedUser._id},
                process.env.SECRET)

            const deleteResponse = await api
                .delete(`/api/blogs/${blogs.reactPatterns._id}`)
                .set('Authorization', `Bearer ${wrongUserIdToken}`)
                .expect(403)

            assert.strictEqual(deleteResponse.body.error, 'Won\'t delete - not your blog!')
        })

        describe('blogin muokkaus', () => {
            test('yksittäisen blogin muokkaus onnistuu', async () => {
                const updateBlog = {
                    title: blogs.reactPatterns.title,
                    author: blogs.reactPatterns.author,
                    likes: blogs.reactPatterns.likes + 1
                }

                const updatedBlog = await api
                    .put(`/api/blogs/${blogs.reactPatterns._id}`)
                    .set('Authorization', `Bearer ${TEST_USER_TOKEN}`)
                    .send(updateBlog)
                    .expect(200)

                assert.strictEqual(updatedBlog.body.likes, blogs.reactPatterns.likes + 1)
            })
        })

        after(async () => {
            await mongoose.connection.close()
            console.log('mongoose connection closed')
        })
    })
})