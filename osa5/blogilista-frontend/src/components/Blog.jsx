import {useState} from "react";

const Blog = ({blog}) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className='blogBox'>
            <b>{blog.title}</b>&nbsp;
            <button onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? 'hide' : 'view'}
            </button>
            {showDetails &&
                <div>
                    {blog.url}<br/>
                    likes {blog.likes}&nbsp;
                    <button>like</button>
                    <br/>
                    {blog.author}
                </div>
            }
        </div>
    )
}

export default Blog