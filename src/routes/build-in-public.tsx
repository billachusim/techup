import { createFileRoute } from "@tanstack/react-router";
import BuildInPublic from "@/pages/BuildInPublic";
import { pageHead, SITE_URL } from "@/lib/seo";
import { BUILD_IN_PUBLIC_PATH, faqs } from "@/data/buildInPublic";

export const Route = createFileRoute("/build-in-public")({
  head: () => {
    const head = pageHead({
      title: "Build in Public: Student Portfolio Guide",
      description:
        "A free Tech Faculty NG guide to building in public: post each class task on LinkedIn, X or WhatsApp and grow a real tech portfolio employers can see.",
      path: BUILD_IN_PUBLIC_PATH,
      type: "article",
    });
    return {
      ...head,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            url: `${SITE_URL}${BUILD_IN_PUBLIC_PATH}`,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  component: BuildInPublic,
});
