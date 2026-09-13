import { createFileRoute } from "@tanstack/react-router";
import TalentPublicProfile from "@/pages/TalentPublicProfile";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/talent/pool/$id")({
  loader: async ({ params }) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.rpc("get_public_talent", {
        profile_id: params.id,
      });
      const person = data?.[0];
      if (!person) return null;
      return {
        title: `${person.full_name} — ${person.headline ?? "Tech talent"}`.slice(0, 60),
        description:
          person.headline ??
          "Vetted tech talent on the Tech Faculty talent pool, available for remote and on-site work.",
      };
    } catch {
      return null;
    }
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Talent Profile | Tech Faculty",
      description:
        loaderData?.description ??
        "View this talent profile on the Tech Faculty talent pool.",
      path: `/talent/pool/${params.id}`,
      type: "profile",
    }),
  component: TalentPublicProfile,
});
