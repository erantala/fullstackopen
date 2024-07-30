const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./blogs_for_test')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs.ALL)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs.reactPatterns])
    assert.strictEqual(result, 7)
  })

  test('of a bigger list is calculated rigth', () => {
    const result = listHelper.totalLikes(blogs.ALL)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals that', () => {
    const result = listHelper.favoriteBlog([blogs.tddHarmsArchitecture])
    assert.deepStrictEqual(result, {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      likes: 0
    })
  })

  test('of a bigger list is the one with most likes', () => {
    const result = listHelper.favoriteBlog(blogs.ALL)
    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals that', () => {
    const result = listHelper.mostBlogs([blogs.tddHarmsArchitecture])
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 1
    })
  })

  test('of a bigger list is the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs.ALL)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})