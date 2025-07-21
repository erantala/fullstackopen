import {useState} from 'react'

const BlogCreation = ({submitBlog}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const submitNewBlog = (event) => {
        event.preventDefault()
        submitBlog({title, author, url})

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>Create new blog</h2>

            <form onSubmit={submitNewBlog}>
                <label>title:</label>&nbsp;
                <input type="text" name="title" value={title} onChange={({target}) => setTitle(target.value)}/><br/>
                <label>author:</label>&nbsp;
                <input type="text" name="author" value={author} onChange={({target}) => setAuthor(target.value)}/><br/>
                <label>url:</label>&nbsp;
                <input type="text" name='url' value={url} onChange={({target}) => setUrl(target.value)}/><br/>
                <button type='submit'>
                    create
                </button>
            </form>
        </div>
    )
}

export default BlogCreation