import { useState } from "react"

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [url, setUrl] = useState("")

    const addBlog = async (event) => {
        event.preventDefault()
        createBlog({
            title,
            author,
            url,
        })

        setTitle("")
        setAuthor("")
        setUrl("")
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    Title:
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    Author:
                    <input
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                    />
                </div>
                <div>
                    URL:
                    <input
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                </div>
                <button type="submit">save</button>
            </form>
        </div>
    )
}

export default BlogForm
