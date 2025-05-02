const _ = require("lodash");

const dummy = (blogs) => {
  return blogs.push(1);
};

const totalLikes = (blogs) => blogs.reduce((acc, curr) => acc + curr.likes, 0);

const favoriteBlog = (blogs) =>
  blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max));

const mostBlogs = (blogs) => {
  const counts = _.countBy(blogs, "author");
  const pairs = _.toPairs(counts);

  const topAuthorPair = _.maxBy(pairs, ([, count]) => count);

  const result = {
    author: topAuthorPair[0],
    blogs: topAuthorPair[1],
  };

  return result;
};

/* const mostLikes = (blogs) => {

}
 */

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
