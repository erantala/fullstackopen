exports.dummy = blogs => {
  return 1
}

exports.totalLikes = blogs => {
  if (blogs.length === 0) {
    return 0
  }

  return blogs.reduce((sumLikes, blog) => sumLikes + blog.likes, 0)
}