const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require("../utils/middleware");

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
  response.json(blogs)
})

// APIS REQUIRING TOKEN
blogsRouter.use(middleware.tokenExtractor)

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(request.token.id)
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
  const user = await User.findById(request.token.id)
  if (user === null) {
    return response.status(401).json({ error: 'user not found'})
  }

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'Won\'t delete - not your blog!'})
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter