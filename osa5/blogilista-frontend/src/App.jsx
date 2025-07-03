import {useState, useEffect} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
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
            const user = await loginService.login({username, password,})
            window.localStorage.setItem(
                'loggedUser', JSON.stringify(user)
            )
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            console.log('wrong credentials')
        }
    }

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                username_
                <input
                    type="text"
                    value={username}
                    name="username"
                    onChange={({target}) => setUsername(target.value)}
                />
            </div>
            <div>
                password_
                <input
                    type="password"
                    value={password}
                    name="password"
                    onChange={({target}) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
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
                <h2>blogs</h2>
                <div>
                    <span>{user.name} logged in </span>
                    <button onClick={() => {
                        window.localStorage.removeItem('loggedUser')
                        setUser(null)
                    }}>logout</button>
                </div>
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog}/>
                )}
            </div>
        )
    }

}

export default App