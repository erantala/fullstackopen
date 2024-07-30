exports.dummy = blogs => {
  return 1
}

exports.totalLikes = blogs => {
  if (blogs.length === 0) {
    return 0
  }

  return blogs.reduce((sumLikes, blog) => sumLikes + blog.likes, 0)
}

exports.favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const favoriteBlog = blogs.reduce((favorite, blog) => favorite.likes > blog.likes ? favorite : blog)
  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

exports.mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const authors = blogs.reduce((authors, blog) => {
    authors[blog.author] = authors[blog.author] ? authors[blog.author] + 1 : 1
    return authors
  }, {})

  const initialValue = { author: '', blogs: 0 }
  const authorWithMostBlogs = Object.entries(authors).reduce(
    (authorWithMostBlogs, [author, blogs]) => {
      return authorWithMostBlogs.blogs > blogs ? authorWithMostBlogs : { author, blogs: blogs }
    }, initialValue)
  return authorWithMostBlogs
}