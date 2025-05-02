const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "URL or title missing" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(400).json({ error: "blog not found" });
  }

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);

    user.blogs = user.blogs.filter(
      (blogId) => blogId.toString() !== request.params.id
    );
    await user.save();

    return response.status(204).end();
  }

  return response
    .status(403)
    .json({ error: "not authorized to delete this blog" });
});

blogsRouter.put("/:id", async (request, response) => {
  const blogToUpdate = await Blog.findById(request.params.id);
  const updatedLikes = blogToUpdate.likes + 1;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: updatedLikes },
    { new: true, runValidators: true }
  );

  response.json(updatedBlog);
});

module.exports = blogsRouter;
