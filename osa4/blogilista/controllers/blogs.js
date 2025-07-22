const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require("../utils/middleware");

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
})

// APIS REQUIRING TOKEN
blogsRouter.use(middleware.tokenExtractor)
blogsRouter.use(middleware.userExtractor)

blogsRouter.post('/', async (request, response) => {
    const user = request.user

    const blog = new Blog(
        {
            ...request.body,
            user: user._id
        })

    const savedBlog = await blog.save()
    const blogWithUserDetail = await savedBlog.populate('user', {username: 1, name: 1, id: 1})
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(blogWithUserDetail)
})

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() !== user.id.toString()) {
        return response.status(403).json({error: 'Won\'t delete - not your blog!'})
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = request.body
    const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, blog, {new: true})
        .populate('user', {username: 1, name: 1, id: 1})
    response.json(updatedBlog)
})

module.exports = blogsRouter