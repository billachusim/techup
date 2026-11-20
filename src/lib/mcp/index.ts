import { defineMcp } from "@lovable.dev/mcp-js";
import listDepartments from "./tools/list_departments";
import listServices from "./tools/list_services";
import listCampuses from "./tools/list_campuses";
import listBlogCategories from "./tools/list_blog_categories";
import listBlogPosts from "./tools/list_blog_posts";
import getBlogPost from "./tools/get_blog_post";
import searchBlog from "./tools/search_blog";
import listBusinessServices from "./tools/list_business_services";
import listSideHustles from "./tools/list_side_hustles";
import listOpenRoles from "./tools/list_open_roles";
import searchJobs from "./tools/search_jobs";
import listJobPlatforms from "./tools/list_job_platforms";
import searchTalentPool from "./tools/search_talent_pool";

// Public server (no sign-in): every tool is read-only and returns only data a signed-out visitor
// can already see on techfaculty.ng. Student account data stays on the website dashboard.
export default defineMcp({
  name: "tech-faculty-ng",
  title: "Tech Faculty NG",
  version: "0.3.0",
  instructions:
    "Public, read-only tools for Tech Faculty NG (techfaculty.ng), a licensed Nigerian tech training institute, jobs marketplace and pay-per-task services provider. No sign-in needed. list_departments and list_campuses: programmes, fees and campuses. list_business_services: 107 fixed-price tasks businesses can order. list_side_hustles: the matching 107 paid side hustles (₦5,000 or ₦10,000 per task, paid weekly). list_open_roles: Tech Faculty roles and client projects; show these first to job seekers. search_jobs: curated remote and AI-training jobs. list_job_platforms: partner platform guides. search_talent_pool: talent for businesses hiring (first names only; introductions go through Tech Faculty). list_services, list_blog_categories, list_blog_posts, get_blog_post, search_blog: services overview and guides. Students manage courses, classes and certificates on the website dashboard.",
  tools: [
    listDepartments,
    listServices,
    listCampuses,
    listBlogCategories,
    listBlogPosts,
    getBlogPost,
    searchBlog,
    listBusinessServices,
    listSideHustles,
    listOpenRoles,
    searchJobs,
    listJobPlatforms,
    searchTalentPool,
  ],
});
