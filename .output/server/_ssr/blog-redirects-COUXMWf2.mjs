//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/blog-redirects-COUXMWf2.js
/**
* Retired blog posts and the post each one now points to (old slug -> new slug).
*
* A retired slug answers with a 301 to its target, and is left out of the blog
* list, RSS, sitemap and the weekly generator's link list, whether the post was
* in src/data/blogPosts.ts or the Supabase blog_posts table. Targets must be live
* posts, never another retired slug. Shared by the site and the edge functions.
*/
var BLOG_REDIRECTS = {
	"tech-faculty-ng-elite-entrepreneurs": "nigerian-startups-win-government-enterprise-contracts-2026",
	"what-is-sves-nigeria-business-elite-explained": "nigerian-business-digitization-roadmap-2026",
	"why-tech-faculty-ng-helps-entrepreneurs": "nigerian-business-digitization-roadmap-2026",
	"skills-gap-nigerian-businesses-tech-training": "nigerian-business-digitization-roadmap-2026",
	"why-nigerian-entrepreneurs-need-ai-implementation-2026": "ai-automation-for-nigerian-businesses-2026",
	"why-nigerian-business-need-ai-innovation-2026": "generative-ai-nigerian-smes-playbook-2026",
	"tut-5-in-design-tech-bootcamps-yabatech-2026": "tech-scene-hubs-and-training-in-lagos-2026",
	"data-analytics-bootcamp-what-youll-learn-16-weeks": "data-analytics-and-visualization-bootcamp-nigeria-2026-guide",
	"how-to-hire-developers-nigerian-startups-2026": "how-to-hire-developers-in-nigeria-2026",
	"power-bi-vs-tableau-nigeria-2026": "power-bi-vs-tableau-vs-looker-nigerian-analysts-2026",
	"remote-tech-jobs-nigeria-2026-complete-guide": "how-to-get-remote-tech-job-from-nigeria-2026",
	"how-to-get-siwes-placement-nigeria-2026-student-guide": "how-to-find-siwes-placement-tech-nigeria-2026",
	"nigerian-student-internships-2026-securing-your-it-attachment": "how-to-find-siwes-placement-tech-nigeria-2026",
	"securing-siwes-placement-internships-nigeria-2026": "how-to-find-siwes-placement-tech-nigeria-2026",
	"nigerian-cybersecurity-salaries-2026-soc-analyst-ethical-hacker-pay": "cybersecurity-salary-nigeria-2026",
	"generative-ai-tools-for-nigerian-businesses-2026": "best-ai-tools-nigerian-businesses-2026",
	"ai-skills-nigerian-small-businesses-2026": "generative-ai-nigerian-smes-playbook-2026",
	"ai-skills-for-nigerian-youth-employment-2026": "how-to-learn-ai-in-nigeria-2026-roadmap",
	"junior-web-mobile-developer-roadmap-nigeria-2026": "full-stack-web-development-nigeria-roadmap-2026",
	"junior-developer-roadmap-nigeria-2026-launching-your-web-mobile-career": "full-stack-web-development-nigeria-roadmap-2026",
	"junior-software-developer-roadmap-nigeria-2026-path-to-tech-career": "full-stack-web-development-nigeria-roadmap-2026",
	"empowering-nigerian-teens-tech-holiday-bootcamps-for-a-brighter-future": "jss3-ss3-holiday-tech-bootcamp-2026",
	"tech-training-for-teens-nigeria-2026-coding-ai-cybersecurity-skills": "best-tech-skills-for-nigerian-teenagers-2026",
	"nigerian-tech-job-search-2026-remote-work-career-shifts": "nigerian-tech-jobs-2026-remote-work-salaries-career-switches",
	"nigerian-tech-job-search-2026-master-remote-work-career-switches": "nigerian-tech-jobs-2026-remote-work-salaries-career-switches",
	"data-analytics-science-careers-nigeria-2026-tools-salaries": "data-analyst-scientist-careers-nigeria-2026-tools-salary",
	"data-analytics-science-careers-nigeria-2026-full-guide": "data-analyst-scientist-careers-nigeria-2026-tools-salary",
	"cybersecurity-career-path-nigeria-2026-protecting-businesses-online": "cybersecurity-careers-nigeria-2026-protecting-businesses-online",
	"nigerian-tech-startups-leveraging-digital-models-for-sme-growth-2026": "funding-tech-startups-nigeria-2026-guide"
};
function isRetiredBlogSlug(slug) {
	return Object.prototype.hasOwnProperty.call(BLOG_REDIRECTS, slug);
}
//#endregion
export { isRetiredBlogSlug as n, BLOG_REDIRECTS as t };
