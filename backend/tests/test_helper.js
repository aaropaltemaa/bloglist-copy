const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "First blog entry",
    author: "Markiplier",
    url: "example.com",
    likes: 2,
  },
  {
    title: "Second blog entry",
    author: "KSI",
    url: "example2.com",
    likes: 6,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((b) => b.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
};
