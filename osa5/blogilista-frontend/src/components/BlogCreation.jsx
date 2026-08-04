import { useState } from 'react'

const BlogCreation = ({ submitBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submitNewBlog = (event) => {
    event.preventDefault()
    submitBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2 id='create-new-blog'>Create new blog</h2>

      <form
        aria-labelledby='create-new-blog'
        onSubmit={submitNewBlog}>
        <label>title
          <span>:&nbsp;</span>
          <input type="text" name="title" value={title} onChange={({ target }) => setTitle(target.value)} />
        </label>
        <br />
        <label>author
          <span>:&nbsp;</span>
          <input type="text" name="author" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </label>
        <br />
        <label>url
          <span>:&nbsp;</span>
          <input type="text" name="url" value={url} onChange={({ target }) => setUrl(target.value)} />
        </label>
        <br />
        <button type="submit">
          create
        </button>
      </form>
    </div>)
}

export default BlogCreation