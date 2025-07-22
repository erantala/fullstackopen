import {useState, useEffect} from "react";

const Blog = ({blog, updateFcn}) => {
    const [showDetails, setShowDetails] = useState(false);
    const [likes, setLikes] = useState(blog.likes);

    useEffect(() => {
        setLikes(blog.likes);
    }, [blog]);

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
                    likes {likes}&nbsp;
                    <button onClick={() => {
                        updateFcn(blog.id, {...blog, likes: likes + 1});
                        setLikes(likes + 1);
                    }}>
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