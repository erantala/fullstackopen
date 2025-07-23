import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification.jsx'
import Togglable from './components/Togglable.jsx'
import BlogCreation from './components/BlogCreation.jsx'

const App = () => {
  const [notification, setNotification] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const sortBlogs = (blogs) => blogs.sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(sortBlogs(blogs))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifySuccess = (message) => {
    setNotification({ type: 'success', message })
    setTimeout(() => setNotification(null), 4000)
  }

  const notifyError = (message) => {
    setNotification({ type: 'error', message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifySuccess('login successful')
    } catch (exception) {
      console.log('wrong credentials')
      notifyError('wrong credentials')
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    blogService.setToken(null)
    notifySuccess('logged out successfully')
  }

  const createBlog = (blogObject) => {
    console.log('creating blog', blogObject)
    blogService
      .create(blogObject)
      .then(newBlog => {
        setBlogs(blogs => blogs.concat(newBlog))
        notifySuccess('new blog added')
        blogFormRef.current.toggleVisibility()
      })
      .catch(() => notifyError('creating blog failed'))
  }

  const deleteBlog = (id) => {
    blogService
      .deleteById(id)
      .then(() => {
        setBlogs(blogs => blogs.filter(blog => blog.id !== id))
        notifySuccess('blog deleted')
      })
      .catch(() => notifyError('deleting blog failed'))
  }

  const incrementBlogLike = (id) => {
    console.log('updating blog with id', id)

    const blogIdx = blogs.findIndex(blog => blog.id === id)
    const blogObject = blogs[blogIdx]
    blogObject.likes += 1
    setBlogs(sortBlogs(blogs.with(blogIdx, blogObject)))

    console.log('updating blog object', blogObject)

    blogService
      .update(id, blogObject)
      .catch(() => {
        notifyError('like failed - reloading blogs')
        blogService.getAll().then(blogs => {
          setBlogs(blogs)
        })
      })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <label>username:</label>&nbsp;
      <input
        type="text"
        value={username}
        name="username"
        onChange={({ target }) => setUsername(target.value)}
      /><br/>
      <label>password:</label>&nbsp;
      <input
        type="password"
        value={password}
        name="password"
        onChange={({ target }) => setPassword(target.value)}
      />
      <button type="submit">login</button>
    </form>
  )

  let pageView

  if (user === null) {
    pageView = (
      <div>
        <h2>Log in to application</h2>
        {loginForm()}
      </div>)
  } else {
    pageView = (
      <div>
        <div>
          <span>{user.name} logged in </span>
          <button onClick={handleLogout}>logout
          </button>
        </div>
        <h2>blogs</h2>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogCreation submitBlog={createBlog}/>
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id}
            blog={blog}
            loggedUser={user}
            incrementLikesFcn={incrementBlogLike}
            deleteBlog={deleteBlog}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <Notification notification={notification}/>
      {
        pageView
      }
    </>
  )

}

export default App