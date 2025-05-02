import { useState } from "react"

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const details = () => {
    return (
      <div>
        {blog.url}
        <div></div>
        likes {blog.likes} <button onClick={() => handleLike(blog.id)}>like</button>
        <div></div>
        {blog.user.name}
        <div></div>
        {blog.user.id === user.id &&
          <button onClick={() => handleDelete(blog.id)}>remove</button>
        }
      </div>
    )
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        <strong>{blog.title}</strong> <em>{blog.author}</em>
        {visible ? (
          <>
            <button onClick={toggleVisibility}>hide</button>
            {details()}
          </>
        ) : (
          <button onClick={toggleVisibility}>view</button>
        )}
      </div>
    </div>
  )
}

export default Blog