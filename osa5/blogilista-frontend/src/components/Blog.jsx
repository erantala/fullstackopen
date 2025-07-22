import {useState} from "react";

const Blog = ({blog, incrementLikesFcn}) => {
    const [showDetails, setShowDetails] = useState(false);

    const userFullName = (user) => {
        return user ? user.name : (<span className='error'>Unknown User</span>);
    };

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
                </div>
            }
        </div>
    )
}

export default Blog