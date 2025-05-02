import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NotificationSuccess from './components/NotificationSuccess'
import NotificationError from './components/NotificationError'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import '../index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser")
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const newBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(newBlog))
    setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} has been added`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const handleLike = async (id) => {
    const blogToLike = blogs.find(b => b.id === id)
    const updatedBlog = await blogService.update(id, { ...blogToLike, likes: blogToLike.likes + 1 })

    updatedBlog.user = blogToLike.user

    setBlogs(blogs
      .map((b) => b.id !== id ? b : updatedBlog)
      .sort((a, b) => b.likes - a.likes)
    )
  }

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find(b => b.id === id)

    if (window.confirm(`Are you sure you want to delete blog "${blogToDelete.title}"?`)) {
      await blogService.remove(id)

      setBlogs(blogs.filter(b => b.id !== id))
      setSuccessMessage(`blog "${blogToDelete.title}" deleted succesfully`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <NotificationError message={errorMessage} />
      <NotificationSuccess message={successMessage} />
      {user === null ? (
        <>
          <h2>Log in to the application</h2>
          {loginForm()}
        </>
      ) : (
        <div>
          <h2>Blogs</h2>
          <p>{user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike} handleDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App