import {useState} from "react";

const Blog = ({blog, loggedUser, incrementLikesFcn, deleteBlog}) => {
    const [showDetails, setShowDetails] = useState(false);

    const userFullName = (user) => {
        return user ? user.name : (<span className='error'>Unknown User</span>);
    };

    const isBlogOwner = (blogOwner) => {
        return blogOwner && blogOwner.username === loggedUser.username;
    }

    const confirmDelete = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            console.log(`Deleting blog with id ${blog.id}`);
            deleteBlog(blog.id)
        } else {
            console.log(`Cancelled deleting blog ${blog.title}`);}
    }

    return (
        <div className='blogBox'>
            <b>{blog.title}</b> {blog.author}&nbsp;
            <button onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? 'hide' : 'view'}
            </button>
            {showDetails &&
                <div>
                    {blog.url}<br/>
                    likes {blog.likes}&nbsp;
                    <button onClick={() => incrementLikesFcn(blog.id)}>
                        like
                    </button>
                    <br/>
                    {userFullName(blog.user)}
                    <br/>
                    {isBlogOwner(blog.user) &&
                        <button onClick={confirmDelete}>remove</button>}
                </div>
            }
        </div>
    )
}

export default Blog