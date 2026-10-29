//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/fees-B-53IxaZ.js
var LEARNING_MODES = [
	{
		id: "online-only",
		name: "Online Only",
		price: 0,
		description: "Self-paced learning with recorded lectures"
	},
	{
		id: "hybrid",
		name: "Hybrid Mode",
		price: 12e3,
		description: "Online + Monthly physical meetups"
	},
	{
		id: "physical",
		name: "Physical Classes",
		price: 22500,
		description: "Weekly on-site classes"
	}
];
var ALL_COURSES = [
	{
		id: "html-css",
		name: "HTML/CSS Fundamentals",
		price: 7500,
		category: "Web Development"
	},
	{
		id: "javascript",
		name: "JavaScript Mastery",
		price: 12e3,
		category: "Web Development"
	},
	{
		id: "react",
		name: "React Development",
		price: 18e3,
		category: "Web Development"
	},
	{
		id: "nodejs",
		name: "Node.js & Backend",
		price: 18e3,
		category: "Web Development"
	},
	{
		id: "database",
		name: "Database Management",
		price: 12e3,
		category: "Web Development"
	},
	{
		id: "fullstack-projects",
		name: "Full-Stack Projects",
		price: 15e3,
		category: "Web Development"
	},
	{
		id: "python",
		name: "Python Programming",
		price: 10500,
		category: "Data Science"
	},
	{
		id: "sql",
		name: "SQL & Databases",
		price: 9e3,
		category: "Data Science"
	},
	{
		id: "data-viz",
		name: "Data Visualization",
		price: 12e3,
		category: "Data Science"
	},
	{
		id: "statistics",
		name: "Statistical Analysis",
		price: 13500,
		category: "Data Science"
	},
	{
		id: "ml-basics",
		name: "Machine Learning Basics",
		price: 22500,
		category: "AI/ML"
	},
	{
		id: "deep-learning",
		name: "Deep Learning",
		price: 27e3,
		category: "AI/ML"
	},
	{
		id: "neural-networks",
		name: "Neural Networks",
		price: 22500,
		category: "AI/ML"
	},
	{
		id: "nlp",
		name: "NLP Fundamentals",
		price: 21e3,
		category: "AI/ML"
	},
	{
		id: "computer-vision",
		name: "Computer Vision",
		price: 21e3,
		category: "AI/ML"
	},
	{
		id: "ai-deployment",
		name: "AI Deployment",
		price: 15e3,
		category: "AI/ML"
	},
	{
		id: "network-security",
		name: "Network Security",
		price: 15e3,
		category: "Cybersecurity"
	},
	{
		id: "ethical-hacking",
		name: "Ethical Hacking",
		price: 22500,
		category: "Cybersecurity"
	},
	{
		id: "soc-ops",
		name: "SOC Operations",
		price: 18e3,
		category: "Cybersecurity"
	},
	{
		id: "incident-response",
		name: "Incident Response",
		price: 12e3,
		category: "Cybersecurity"
	},
	{
		id: "comptia-prep",
		name: "CompTIA Prep",
		price: 15e3,
		category: "Cybersecurity"
	},
	{
		id: "ceh-prep",
		name: "CEH Prep",
		price: 18e3,
		category: "Cybersecurity"
	},
	{
		id: "aws",
		name: "AWS Fundamentals",
		price: 18e3,
		category: "Cloud/DevOps"
	},
	{
		id: "azure",
		name: "Azure Basics",
		price: 18e3,
		category: "Cloud/DevOps"
	},
	{
		id: "gcp",
		name: "GCP Essentials",
		price: 18e3,
		category: "Cloud/DevOps"
	},
	{
		id: "kubernetes",
		name: "Kubernetes & Docker",
		price: 22500,
		category: "Cloud/DevOps"
	},
	{
		id: "cicd",
		name: "CI/CD Pipelines",
		price: 15e3,
		category: "Cloud/DevOps"
	},
	{
		id: "cloud-cert",
		name: "Cloud Certifications",
		price: 12e3,
		category: "Cloud/DevOps"
	},
	{
		id: "figma",
		name: "Figma Mastery",
		price: 12e3,
		category: "Design"
	},
	{
		id: "adobe",
		name: "Adobe Suite",
		price: 15e3,
		category: "Design"
	},
	{
		id: "product-design",
		name: "Product Design",
		price: 18e3,
		category: "Design"
	},
	{
		id: "design-principles",
		name: "Design Principles",
		price: 9e3,
		category: "Design"
	},
	{
		id: "design-systems",
		name: "Design Systems",
		price: 13500,
		category: "Design"
	},
	{
		id: "portfolio-projects",
		name: "Portfolio Projects",
		price: 10500,
		category: "Design"
	},
	{
		id: "social-media",
		name: "Social Media Strategy",
		price: 10500,
		category: "Marketing"
	},
	{
		id: "content-marketing",
		name: "Content Marketing",
		price: 12e3,
		category: "Marketing"
	},
	{
		id: "seo-sem",
		name: "SEO/SEM",
		price: 15e3,
		category: "Marketing"
	},
	{
		id: "video-editing",
		name: "Video Editing",
		price: 13500,
		category: "Marketing"
	},
	{
		id: "photo-editing",
		name: "Photo Editing",
		price: 9e3,
		category: "Marketing"
	},
	{
		id: "analytics",
		name: "Analytics & Growth",
		price: 12e3,
		category: "Marketing"
	},
	{
		id: "react-native",
		name: "React Native Development",
		price: 18e3,
		category: "Mobile Development"
	},
	{
		id: "flutter-dart",
		name: "Flutter & Dart",
		price: 18e3,
		category: "Mobile Development"
	},
	{
		id: "ios-swift",
		name: "iOS with Swift",
		price: 21e3,
		category: "Mobile Development"
	},
	{
		id: "android-kotlin",
		name: "Android with Kotlin",
		price: 21e3,
		category: "Mobile Development"
	},
	{
		id: "mobile-uiux",
		name: "Mobile UI/UX Design",
		price: 12e3,
		category: "Mobile Development"
	},
	{
		id: "cross-platform-projects",
		name: "Cross-Platform Projects",
		price: 15e3,
		category: "Mobile Development"
	}
];
var PLAN_PRICING = {
	"bootcamp-starter": {
		minimumAmount: 0,
		courses: [
			{
				id: "intro-programming",
				name: "Intro to Programming",
				price: 0
			},
			{
				id: "intro-ai-chatgpt",
				name: "Intro to AI & ChatGPT",
				price: 0
			},
			{
				id: "git-github",
				name: "Git & GitHub Basics",
				price: 0
			},
			{
				id: "tech-career",
				name: "Tech Career Guidance",
				price: 0
			}
		],
		learningModes: [{
			id: "online-only",
			name: "Online Only",
			price: 0,
			description: "Self-paced learning"
		}],
		benefits: [
			{
				id: "community",
				name: "Community Access",
				price: 0,
				description: "Join our vibrant tech community"
			},
			{
				id: "self-paced",
				name: "Self-Paced Learning",
				price: 0,
				description: "Learn at your own pace"
			},
			{
				id: "basic-certificate",
				name: "Completion Certificate",
				price: 0,
				description: "Get certified on completion"
			}
		]
	},
	"developer-pro": {
		minimumAmount: 5e4,
		courses: [
			{
				id: "html-css",
				name: "HTML/CSS Fundamentals",
				price: 7500
			},
			{
				id: "javascript",
				name: "JavaScript Mastery",
				price: 12e3
			},
			{
				id: "react",
				name: "React Development",
				price: 18e3
			},
			{
				id: "nodejs",
				name: "Node.js & Backend",
				price: 18e3
			},
			{
				id: "database",
				name: "Database Management",
				price: 12e3
			},
			{
				id: "fullstack-projects",
				name: "Full-Stack Projects",
				price: 15e3
			}
		],
		learningModes: LEARNING_MODES,
		benefits: [
			{
				id: "job-placement",
				name: "Job Placement Support",
				price: 15e3,
				description: "Get help finding your first job"
			},
			{
				id: "internship",
				name: "Internship Access",
				price: 12e3,
				description: "Access to partner internships"
			},
			{
				id: "mentor-network",
				name: "Mentor Network Access",
				price: 18e3,
				description: "Connect with industry mentors"
			},
			{
				id: "certification-prep",
				name: "Industry Certification Prep",
				price: 22500,
				description: "Prepare for industry certifications"
			},
			{
				id: "tech-certificate",
				name: "Tech Faculty Certificate",
				price: 0,
				description: "Official completion certificate"
			}
		]
	},
	"data-wizard": {
		minimumAmount: 1e5,
		courses: [
			{
				id: "python",
				name: "Python Programming",
				price: 10500
			},
			{
				id: "sql",
				name: "SQL & Databases",
				price: 9e3
			},
			{
				id: "data-viz",
				name: "Data Visualization",
				price: 12e3
			},
			{
				id: "statistics",
				name: "Statistical Analysis",
				price: 13500
			},
			{
				id: "ml-basics",
				name: "Machine Learning Basics",
				price: 22500
			},
			{
				id: "data-projects",
				name: "Real-world Data Projects",
				price: 15e3
			}
		],
		learningModes: LEARNING_MODES,
		benefits: [
			{
				id: "job-placement",
				name: "Job Placement Support",
				price: 15e3,
				description: "Get help finding your first job"
			},
			{
				id: "internship",
				name: "Internship Access",
				price: 12e3,
				description: "Access to partner internships"
			},
			{
				id: "mentor-network",
				name: "Mentor Network Access",
				price: 18e3,
				description: "Connect with industry mentors"
			},
			{
				id: "one-on-one",
				name: "One-on-One Mentorship (1hr/week)",
				price: 3e4,
				description: "Personal guidance from experts"
			},
			{
				id: "tech-certificate",
				name: "Tech Faculty Certificate",
				price: 0,
				description: "Official completion certificate"
			}
		]
	},
	"ai-innovator": {
		minimumAmount: 15e4,
		courses: [
			{
				id: "deep-learning",
				name: "Deep Learning",
				price: 27e3
			},
			{
				id: "neural-networks",
				name: "Neural Networks",
				price: 22500
			},
			{
				id: "tensorflow-pytorch",
				name: "TensorFlow/PyTorch",
				price: 18e3
			},
			{
				id: "nlp",
				name: "NLP Fundamentals",
				price: 21e3
			},
			{
				id: "computer-vision",
				name: "Computer Vision",
				price: 21e3
			},
			{
				id: "ai-deployment",
				name: "AI Deployment",
				price: 15e3
			}
		],
		learningModes: LEARNING_MODES,
		benefits: [
			{
				id: "job-placement",
				name: "Job Placement Support",
				price: 15e3,
				description: "Get help finding your first job"
			},
			{
				id: "internship",
				name: "Internship Access",
				price: 12e3,
				description: "Access to partner internships"
			},
			{
				id: "mentor-network",
				name: "Mentor Network Access",
				price: 18e3,
				description: "Connect with industry mentors"
			},
			{
				id: "one-on-one",
				name: "One-on-One Mentorship (1hr/week)",
				price: 3e4,
				description: "Personal guidance from experts"
			},
			{
				id: "vip-classes",
				name: "VIP Classes at Chosen Location",
				price: 75e3,
				description: "Premium learning experience"
			},
			{
				id: "tech-certificate",
				name: "Tech Faculty Certificate",
				price: 0,
				description: "Official completion certificate"
			}
		]
	},
	"security-shield": {
		minimumAmount: 12e4,
		courses: [
			{
				id: "network-security",
				name: "Network Security",
				price: 15e3
			},
			{
				id: "ethical-hacking",
				name: "Ethical Hacking",
				price: 22500
			},
			{
				id: "soc-ops",
				name: "SOC Operations",
				price: 18e3
			},
			{
				id: "incident-response",
				name: "Incident Response",
				price: 12e3
			},
			{
				id: "comptia-prep",
				name: "CompTIA Prep",
				price: 15e3
			},
			{
				id: "ceh-prep",
				name: "CEH Prep",
				price: 18e3
			}
		],
		learningModes: LEARNING_MODES,
		benefits: [
			{
				id: "job-placement",
				name: "Job Placement Support",
				price: 15e3,
				description: "Get help finding your first job"
			},
			{
				id: "internship",
				name: "Internship Access",
				price: 12e3,
				description: "Access to partner internships"
			},
			{
				id: "mentor-network",
				name: "Mentor Network Access",
				price: 18e3,
				description: "Connect with industry mentors"
			},
			{
				id: "certification-prep",
				name: "Industry Certification Prep",
				price: 22500,
				description: "Prepare for industry certifications"
			},
			{
				id: "tech-certificate",
				name: "Tech Faculty Certificate",
				price: 0,
				description: "Official completion certificate"
			}
		]
	},
	"mobile-app-developer": {
		minimumAmount: 8e4,
		courses: [
			{
				id: "react-native",
				name: "React Native Development",
				price: 18e3
			},
			{
				id: "flutter-dart",
				name: "Flutter & Dart",
				price: 18e3
			},
			{
				id: "ios-swift",
				name: "iOS with Swift",
				price: 21e3
			},
			{
				id: "android-kotlin",
				name: "Android with Kotlin",
				price: 21e3
			},
			{
				id: "mobile-uiux",
				name: "Mobile UI/UX Design",
				price: 12e3
			},
			{
				id: "cross-platform-projects",
				name: "Cross-Platform Projects",
				price: 15e3
			}
		],
		learningModes: LEARNING_MODES,
		benefits: [
			{
				id: "job-placement",
				name: "Job Placement Support",
				price: 15e3,
				description: "Get help finding your first job"
			},
			{
				id: "internship",
				name: "Internship Access",
				price: 12e3,
				description: "Access to partner internships"
			},
			{
				id: "mentor-network",
				name: "Mentor Network Access",
				price: 18e3,
				description: "Connect with industry mentors"
			},
			{
				id: "certification-prep",
				name: "Industry Certification Prep",
				price: 22500,
				description: "Prepare for industry certifications"
			},
			{
				id: "tech-certificate",
				name: "Tech Faculty Certificate",
				price: 0,
				description: "Official completion certificate"
			}
		]
	},
	"cloud-architect": {
		minimumAmount: 13e4,
		courses: [
			{
				id: "aws",
				name: "AWS Fundamentals",
				price: 18e3
			},
			{
				id: "azure",
				name: "Azure Basics",
				price: 18e3
			},
			{
				id: "gcp",
				name: "GCP Essentials",
				price: 18e3
			},
			{
				id: "kubernetes",
				name: "Kubernetes & Docker",
				price: 22500
			},
			{
				id: "cicd",
				name: "CI/CD Pipelines",
				price: 15e3
			},
			{
				id: "cloud-cert",
				name: "Cloud Certifications",
				price: 12e3
			}
		],
		learningModes: LEARNING_MODES,
		benefits: [
			{
				id: "job-placement",
				name: "Job Placement Support",
				price: 15e3,
				description: "Get help finding your first job"
			},
			{
				id: "internship",
				name: "Internship Access",
				price: 12e3,
				description: "Access to partner internships"
			},
			{
				id: "mentor-network",
				name: "Mentor Network Access",
				price: 18e3,
				description: "Connect with industry mentors"
			},
			{
				id: "certification-prep",
				name: "Industry Certification Prep",
				price: 22500,
				description: "Prepare for industry certifications"
			},
			{
				id: "tech-certificate",
				name: "Tech Faculty Certificate",
				price: 0,
				description: "Official completion certificate"
			}
		]
	},
	"design-master": {
		minimumAmount: 7e4,
		courses: [
			{
				id: "design-principles",
				name: "Design Principles",
				price: 9e3
			},
			{
				id: "figma",
				name: "Figma Mastery",
				price: 12e3
			},
			{
				id: "adobe",
				name: "Adobe Suite",
				price: 15e3
			},
			{
				id: "product-design",
				name: "Product Design",
				price: 18e3
			},
			{
				id: "design-systems",
				name: "Design Systems",
				price: 13500
			},
			{
				id: "portfolio-projects",
				name: "Portfolio Projects",
				price: 10500
			}
		],
		learningModes: LEARNING_MODES,
		benefits: [
			{
				id: "job-placement",
				name: "Job Placement Support",
				price: 15e3,
				description: "Get help finding your first job"
			},
			{
				id: "internship",
				name: "Internship Access",
				price: 12e3,
				description: "Access to partner internships"
			},
			{
				id: "mentor-network",
				name: "Mentor Network Access",
				price: 18e3,
				description: "Connect with industry mentors"
			},
			{
				id: "tech-certificate",
				name: "Tech Faculty Certificate",
				price: 0,
				description: "Official completion certificate"
			}
		]
	},
	"digital-marketing-pro": {
		minimumAmount: 6e4,
		courses: [
			{
				id: "social-media",
				name: "Social Media Strategy",
				price: 10500
			},
			{
				id: "content-marketing",
				name: "Content Marketing",
				price: 12e3
			},
			{
				id: "seo-sem",
				name: "SEO/SEM",
				price: 15e3
			},
			{
				id: "video-editing",
				name: "Video Editing",
				price: 13500
			},
			{
				id: "photo-editing",
				name: "Photo Editing",
				price: 9e3
			},
			{
				id: "analytics",
				name: "Analytics & Growth",
				price: 12e3
			}
		],
		learningModes: LEARNING_MODES,
		benefits: [
			{
				id: "job-placement",
				name: "Job Placement Support",
				price: 15e3,
				description: "Get help finding your first job"
			},
			{
				id: "internship",
				name: "Internship Access",
				price: 12e3,
				description: "Access to partner internships"
			},
			{
				id: "mentor-network",
				name: "Mentor Network Access",
				price: 18e3,
				description: "Connect with industry mentors"
			},
			{
				id: "tech-certificate",
				name: "Tech Faculty Certificate",
				price: 0,
				description: "Official completion certificate"
			}
		]
	},
	"custom-builder": {
		minimumAmount: 5e4,
		courses: [],
		learningModes: LEARNING_MODES,
		benefits: [
			{
				id: "job-placement",
				name: "Job Placement Support",
				price: 15e3,
				description: "Get help finding your first job"
			},
			{
				id: "internship",
				name: "Internship Access",
				price: 12e3,
				description: "Access to partner internships"
			},
			{
				id: "mentor-network",
				name: "Mentor Network Access",
				price: 18e3,
				description: "Connect with industry mentors"
			},
			{
				id: "certification-prep",
				name: "Industry Certification Prep",
				price: 22500,
				description: "Prepare for industry certifications"
			}
		]
	}
};
/** The fixed promo codes and the share of the total each one takes off. */
var PROMO_CODES = {
	TECHUP50: 50,
	TECHUP25: 25
};
var INSTALMENTS = {
	enabled: true,
	depositPercent: 50,
	balanceDueDays: 30,
	/** Plans totalling less than this (after any discount) are paid in full. */
	minimumTotal: 5e4
};
/** The deposit and balance for a total in naira, or null when it can't be split. */
function instalmentSplit(total) {
	if (!INSTALMENTS.enabled || total < INSTALMENTS.minimumTotal) return null;
	const deposit = Math.round(total * INSTALMENTS.depositPercent / 100);
	return {
		deposit,
		balance: total - deposit
	};
}
/** Naira per US dollar, the same rate create-checkout uses for USD payments. */
var NGN_TO_USD_RATE = 1400;
/** A naira amount in whole US dollars at the checkout rate. */
var toUsd = (amount) => Math.round(amount / NGN_TO_USD_RATE);
var naira = (amount) => `₦${amount.toLocaleString("en-NG")}`;
var modeFee = (id) => LEARNING_MODES.find((m) => m.id === id)?.price ?? 0;
/** Extra charged on top of the online fee for each study mode. */
var HYBRID_FEE = modeFee("hybrid");
var PHYSICAL_FEE = modeFee("physical");
/** Lowest checkout amount for a pricing plan, or undefined for an unknown plan. */
var planMinimum = (planId) => PLAN_PRICING[planId]?.minimumAmount;
/** Holiday teen programme fees (2026), as published on the blog. */
var TEEN_HOLIDAY_FROM = {
	amount: 45e3,
	weeks: 4
};
/** Cheapest paid department plan, for "from ₦…" copy. */
var LOWEST_PAID_PLAN = Math.min(...Object.values(PLAN_PRICING).map((p) => p.minimumAmount).filter((n) => n > 0));
//#endregion
export { LOWEST_PAID_PLAN as a, PLAN_PRICING as c, instalmentSplit as d, naira as f, LEARNING_MODES as i, PROMO_CODES as l, toUsd as m, HYBRID_FEE as n, NGN_TO_USD_RATE as o, planMinimum as p, INSTALMENTS as r, PHYSICAL_FEE as s, ALL_COURSES as t, TEEN_HOLIDAY_FROM as u };
