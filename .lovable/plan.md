

# Updated Plan: Website Expansion

## Correction: Student IT → SIWES / Industrial Training

The "Student IT" page is now a **SIWES & Industrial Training** page (`/siwes`) focused on:

- **What it is**: Student Industrial Work Experience Scheme (SIWES) placements at Tech Faculty NG, regulated under the Federal Ministry of Education
- **Two tracks**:
  1. **Learn & Pay**: Students pay a fee to gain structured, real-world tech experience during their IT placement (hands-on projects, mentorship, certification)
  2. **Tutor & Earn**: Skilled students can tutor other learners and get paid while completing their IT
- **What students get**: Real project experience, mentorship, certificate of completion, recommendation letters, potential employment pipeline
- **How to apply**: Application form or WhatsApp CTA with required info (school, department, duration, preferred track)
- **Credibility banner**: Licensed via FMSTI/NBTI — reinforces legitimacy for university administrators approving placements

## All Pages Summary

| Page | Route | Focus |
|------|-------|-------|
| Business Partnerships | `/business-partnerships` | Corporate training, AI workshops, digitization |
| School Collaborations | `/school-collaborations` | University bootcamps, curriculum integration |
| Events | `/events` | Community workshops, hackathons, speaker sessions |
| **SIWES & Industrial Training** | `/siwes` | IT placements — Learn & Pay or Tutor & Earn tracks |
| About | `/about` | Mission, team, FMSTI/NBTI partnership story |

## Files

Everything from the previous plan remains the same except:

| File | Change |
|------|--------|
| `src/pages/StudentIT.tsx` → `src/pages/SIWES.tsx` | SIWES placement page with two tracks |
| `src/App.tsx` | Route `/siwes` instead of `/student-it` |
| `src/components/Header.tsx` | Nav label "SIWES / IT" instead of "Student IT" |
| `src/components/Footer.tsx` | Updated link label |
| `src/components/ServicesSection.tsx` | Card updated to reflect SIWES |

No other changes to the plan. No database needed.

