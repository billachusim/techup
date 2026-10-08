import { Fragment, type ReactNode } from "react";
import { Link } from "@/lib/router-compat";
import type { BlogPost } from "@/types/blog";
import { campuses } from "@/data/campuses";
import { getCityGuideForCity, getPostLinks, isCityGuide } from "@/data/internalLinks";

const linkClass = "text-primary hover:underline";

/** "a", "a and b", "a, b and c" for a list of nodes. */
const joinNodes = (nodes: ReactNode[]) =>
  nodes.map((node, i) => (
    <Fragment key={i}>
      {i > 0 && (i === nodes.length - 1 ? " and " : ", ")}
      {node}
    </Fragment>
  ));

/** In-article links from a blog post to the departments, campuses and SIWES pages it relates to. */
const PostInternalLinks = ({ post }: { post: BlogPost }) => {
  // City guides already link their campus, departments and SIWES in the body.
  if (isCityGuide(post.slug)) return null;
  const links = getPostLinks(post);
  const cityGuides = links.campuses
    .map((c) => getCityGuideForCity(c.city))
    .filter((g): g is NonNullable<typeof g> => Boolean(g) && g!.slug !== post.slug);

  return (
    <section className="mt-12 border-t border-border pt-8" aria-labelledby="learn-this-heading">
      <h2 id="learn-this-heading" className="text-2xl font-bold mb-4">
        Where to learn this at Tech Faculty
      </h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          {links.departments.length > 0 ? (
            <>
              Tech Faculty teaches this in{" "}
              {joinNodes(
                links.departments.map((d) => (
                  <Link key={d.slug} to={`/departments/${d.slug}`} className={linkClass}>
                    the {d.title} programme
                  </Link>
                )),
              )}
              , online, hybrid or in person. You can also{" "}
              <Link to="/departments" className={linkClass}>
                compare all Tech Faculty departments
              </Link>
              .
            </>
          ) : (
            <>
              Compare{" "}
              <Link to="/departments" className={linkClass}>
                every Tech Faculty department
              </Link>{" "}
              to find the course that fits, online, hybrid or in person.
            </>
          )}
        </p>
        <p>
          {links.campuses.length > 0 ? (
            <>
              You can study in person at{" "}
              {joinNodes(
                links.campuses.map((c) => (
                  <Link key={c.slug} to={`/locations/${c.slug}`} className={linkClass}>
                    the Tech Faculty campus in {c.city}
                  </Link>
                )),
              )}
              , or{" "}
              <Link to="/locations" className={linkClass}>
                find a Tech Faculty campus near you
              </Link>
              .
              {cityGuides.length > 0 && (
                <>
                  {" "}
                  For the wider local picture, read{" "}
                  {joinNodes(
                    cityGuides.map((g) => (
                      <Link key={g.slug} to={`/blog/${g.slug}`} className={linkClass}>
                        our guide to the {g.city} tech scene
                      </Link>
                    )),
                  )}
                  .
                </>
              )}
            </>
          ) : (
            <>
              Classes also run in person at{" "}
              <Link to="/locations" className={linkClass}>
                Tech Faculty campuses in {campuses.length} cities across Nigeria
              </Link>
              .
            </>
          )}
        </p>
        {links.siwes && (
          <p>
            Students on industrial training can do their{" "}
            <Link to="/siwes" className={linkClass}>
              tech SIWES placement at Tech Faculty
            </Link>
            , or apply for{" "}
            <Link to="/virtual-siwes" className={linkClass}>
              Virtual SIWES with logbook signing
            </Link>{" "}
            if they cannot attend in person.
          </p>
        )}
      </div>
    </section>
  );
};

export default PostInternalLinks;
