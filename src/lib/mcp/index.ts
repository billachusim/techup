import { defineMcp } from "@lovable.dev/mcp-js";
import listDepartments from "./tools/list_departments";
import listServices from "./tools/list_services";
import listCampuses from "./tools/list_campuses";
import listBlogCategories from "./tools/list_blog_categories";
import listBlogPosts from "./tools/list_blog_posts";
import getBlogPost from "./tools/get_blog_post";
import searchBlog from "./tools/search_blog";

export default defineMcp({
  name: "tech-faculty-mcp",
  title: "Tech Faculty",
  version: "0.1.0",
  instructions:
    "Public tools for Tech Faculty NG (techfaculty.ng): browse departments/tracks, blog posts (with like counts), blog categories, campus locations, and services. Use list_blog_categories then list_blog_posts to browse content, or search_blog to find posts by keyword, then get_blog_post for full markdown.",
  tools: [
    listDepartments,
    listServices,
    listCampuses,
    listBlogCategories,
    listBlogPosts,
    getBlogPost,
    searchBlog,
  ],
});
