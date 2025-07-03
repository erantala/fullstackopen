import {useState, useEffect} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const emptyBlog = {title: '', author: '', url: ''}

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [blogInput, setBlogInput] = useState(emptyBlog)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)

        try {
            const user = await loginService.login({username, password})
            window.localStorage.setItem(
                'loggedUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            console.log('wrong credentials')
        }
    }

    const handleLogout = (event) => {
        window.localStorage.removeItem('loggedUser')
        setUser(null)
        blogService.setToken(null)
    }

    const createBlog = (event) => {
        event.preventDefault()
        const blogObject = {
            title: blogInput.title,
            author: blogInput.author,
            url: blogInput.url
        }
        console.log('creating blog', blogObject)
        blogService
            .create(blogObject)
            .then(newBlog => {
                setBlogs(blogs => blogs.concat(newBlog))
                setBlogInput(emptyBlog)
            })
    }

    const handleBlogChange = ({target}) => {
        setBlogInput(blogInput => ({
            ...blogInput,
            [target.name]: target.value
        }))
    }

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <label>username:</label>&nbsp;
            <input
                type="text"
                value={username}
                name="username"
                onChange={({target}) => setUsername(target.value)}
            />
            <label>password:</label>&nbsp;
            <input
                type="password"
                value={password}
                name="password"
                onChange={({target}) => setPassword(target.value)}
            />
            <button type="submit">login</button>
        </form>
    )

    const blogForm = () => (
        <form onSubmit={createBlog}>
            <label>title:</label>&nbsp;
            <input type="text" name="title" value={blogInput.title} onChange={handleBlogChange}/><br/>
            <label>author:</label>&nbsp;
            <input type="text" name="author" value={blogInput.author} onChange={handleBlogChange}/><br/>
            <label>url:</label>&nbsp;
            <input type="text" name='url' value={blogInput.url} onChange={handleBlogChange}/><br/>
            <button type='submit'>
                create
            </button>
        </form>
    )

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>
                {loginForm()}
            </div>
        )
    } else {
        return (
            <div>
                <div>
                    <span>{user.name} logged in </span>
                    <button onClick={handleLogout}>logout
                    </button>
                </div>
                <h2>blogs</h2>
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog}/>
                )}
                <h2>create new</h2>
                {blogForm()}
            </div>
        )
    }

}

export default App