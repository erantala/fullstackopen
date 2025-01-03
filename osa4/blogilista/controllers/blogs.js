const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require("jsonwebtoken");

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const getTokenFrom = () => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

  const body = request.body
  const authenticationToken = getTokenFrom()
  if (authenticationToken === null) {
    return response.status(401).json({ error: 'token missing, expected authorization type Bearer' })
  }
  let decodedToken = null
  try {
    decodedToken = jwt.verify(getTokenFrom(), process.env.SECRET)
    decodedToken.id.throwErrorIfUndefined
  } catch {
    return response.status(401).json({ error: 'invalid jwt token'})
  }
  const user = await User.findById(decodedToken.id)
  if (user === null) {
    return response.status(401).json({ error: 'user not found'})
  }

  const blog = new Blog(
      {
        ...request.body,
        user: user._id
      })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter