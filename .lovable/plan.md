

## Plan: Add Mobile App Development to Development Tier & Update Faculty AI

### What Changes

**1. Add "Mobile App Developer" plan to `src/components/Pricing.tsx`**
- Add a new `DepartmentPlan` entry under `category: "development"` (alongside Developer Pro and Cloud Architect)
- Include courses: React Native Development, Flutter & Dart, iOS with Swift, Android with Kotlin, Mobile UI/UX Design, Cross-Platform Projects
- Set minimum amount to ₦80,000 (consistent with other development tier plans)
- Use the `Smartphone` icon (already imported in Departments.tsx, will need importing here)
- Add mobile app courses to `allAvailableCourses` array for the custom builder

**2. Update Faculty AI system prompt in `supabase/functions/faculty-ai-chat/index.ts`**
- Rewrite the system prompt to include ALL current departments and their courses:
  - Web Development, Mobile App Development, Data Science & Analytics, Cybersecurity, AI & Machine Learning, Basic Internet & AI Studies, Social Media & Digital Marketing, Design, Cloud Computing, Robotics & IoT
- Include pricing tiers: Free Foundation, Developer Pro, Mobile App Developer, Data Wizard, AI Innovator, Security Shield, Cloud Architect, Design Master, Digital Marketing Pro, Custom Program
- Ensure the AI can accurately recommend plans and courses across all departments

### Files Modified
1. `src/components/Pricing.tsx` — Add mobile courses to `allAvailableCourses`, add new "Mobile App Developer" plan to `departmentPlans`, import `Smartphone` icon
2. `supabase/functions/faculty-ai-chat/index.ts` — Rewrite system prompt with complete course/department catalog

