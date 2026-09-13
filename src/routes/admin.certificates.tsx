import { createFileRoute } from "@tanstack/react-router";
import AdminCertificates from "@/pages/AdminCertificates";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/certificates")({
  head: () =>
    pageHead({
      title: "Admin · Add Certificate | Tech Faculty NG",
      description: "Administrative certificate management for Tech Faculty NG.",
      path: "/admin/certificates",
      noindex: true,
    }),
  component: AdminCertificates,
});
