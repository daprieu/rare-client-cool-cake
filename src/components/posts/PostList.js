import React, { useContext, useEffect, useRef, useState } from "react"
import { PostContext } from "./PostProvider"
import { Link, useHistory, useParams } from "react-router-dom"
import "./Post.css"

export const PostList = () => {
    const { posts, getPosts, getPostsByUserId, deletePost, setPosts , filterPostsByTag} = useContext(PostContext)
    const CurrentUserId = localStorage.getItem("userId")

    const { userId } = useParams()
    const history = useHistory()
    
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    
    
    useEffect(() => {
        
        if (userId) {
            if (userId !== CurrentUserId) {
                setIsLoading(false)
            } else {
                getPostsByUserId(userId)
                .then(() => setIsLoading(false))

            }
        } else {
            getPosts()
            .then(() => setIsLoading(false))
        }
    }, [])
    
    const handleDelete = ( id ) => {
        
        if(window.confirm("Confirm Deletion")) {
            deletePost(id, userId)
            .then(() => history.push(`/posts/user/${userId}`))
        }
    }

    const handleInputChange = ( event ) => {
        const newTerm = event.target.value
        setSearchTerm(newTerm)
        filterPostsByTag(newTerm).then(setPosts)
    }

    // So we wouldn't have to worry about missing ?'s in the return component
    // and avoid the "cannot find label of undefined" error.
    if(isLoading) return (<div>Loading</div>)

    
    return (<>
        
        <div>
            <div> Ordered By Most Recent First</div>
            <input className="tagSearchBar" type="text" placeholder={"Search by tag"} value={searchTerm} onChange={handleInputChange}/>
            {posts.map(post =>

                <div className="post_card" key={post.id}>
                    <p><b>Title: </b><Link to={`/posts/detail/${post.id}`}> {post.title}</Link></p>
                    <p><b>Author: </b>{post.user.first_name} {post.user.last_name}</p>
                    <p><b>Category: </b>{post.category.label}</p>
                    <p><b>Posted: </b>{post.publication_date}</p>
                    {/* <p><b>Posted: </b>{post.publication_date}</p>
                    <p><b>user id: </b>{post.user.id}</p> */}

                    {
                        parseInt(CurrentUserId)  === post.user.id
                        ? <button >
                            <Link to={{ pathname: `/posts/user/edit/${post.id}`
                            }}>edit</Link>
                        </button> 
                        : ""
                    }
                    {
                        parseInt(CurrentUserId)  === post.user.id 
                        ?
                        <button type="button" id="deletePost" onClick={(e) => {
                            e.preventDefault()
                            handleDelete(post.id)
                        }}>Delete</button>
                        : <></>
                    }
                </div>
            )}
        </div>
        
    </>)
}



