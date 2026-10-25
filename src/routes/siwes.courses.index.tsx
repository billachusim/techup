import { createFileRoute } from "@tanstack/react-router";
import SiwesCourses from "@/pages/SiwesCourses";
import { ogImage, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/siwes/courses/")({
  head: () =>
    pageHead({
      title: "SIWES by Course of Study in Nigeria",
      description:
        "Find the right tech SIWES placement for your course: engineering, mass communication, statistics, accounting, OTM and computer science, online or on site.",
      path: "/siwes/courses",
      image: ogImage("siwes.jpg"),
    }),
  component: SiwesCourses,
});
