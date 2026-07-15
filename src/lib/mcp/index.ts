import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listDepartments from "./tools/list_departments";
import listServices from "./tools/list_services";
import listCampuses from "./tools/list_campuses";
import listBlogCategories from "./tools/list_blog_categories";
import listBlogPosts from "./tools/list_blog_posts";
import getBlogPost from "./tools/get_blog_post";
import searchBlog from "./tools/search_blog";
import likeBlogPost from "./tools/like_blog_post";
import unlikeBlogPost from "./tools/unlike_blog_post";
import getMyProfile from "./tools/get_my_profile";
import updateMyProfile from "./tools/update_my_profile";
import listMyEnrollments from "./tools/list_my_enrollments";
import listMyCourses from "./tools/list_my_courses";
import listMyCertificates from "./tools/list_my_certificates";
import listMyUpcomingClasses from "./tools/list_my_upcoming_classes";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "tech-faculty-mcp",
  title: "Tech Faculty",
  version: "0.1.0",
  instructions:
    "Tools for Tech Faculty NG (techfaculty.ng). Public (no login): list_departments, list_services, list_campuses, list_blog_categories, list_blog_posts, get_blog_post, search_blog. Signed-in user tools (require OAuth): like_blog_post, unlike_blog_post, get_my_profile, update_my_profile, list_my_enrollments, list_my_courses, list_my_certificates, list_my_upcoming_classes. All user-scoped tools act as the caller under Tech Faculty's row-level security.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listDepartments,
    listServices,
    listCampuses,
    listBlogCategories,
    listBlogPosts,
    getBlogPost,
    searchBlog,
    likeBlogPost,
    unlikeBlogPost,
    getMyProfile,
    updateMyProfile,
    listMyEnrollments,
    listMyCourses,
    listMyCertificates,
    listMyUpcomingClasses,
  ],
});
