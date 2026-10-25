import { describe, expect, it } from "vitest";
import { audienceProblem, countryCode } from "../../supabase/functions/_shared/event-audience";

const base = {
  title: "Build with Gemini: hands-on AI workshop",
  description: "A practical session on building apps with large language models.",
  organizer: "Community",
  format: "IN_PERSON",
  source_platform: "Meetup",
};

describe("audienceProblem", () => {
  it("keeps Nigerian and other African events", () => {
    expect(audienceProblem({ ...base, city: "Lagos", country: "NG" })).toBeNull();
    expect(audienceProblem({ ...base, venue_name: "TIC, Umudim", city: "Nnewi" })).toBeNull();
    expect(audienceProblem({ ...base, city: "Nairobi", country: "Kenya" })).toBeNull();
  });

  it("keeps online events open to anyone", () => {
    expect(audienceProblem({ ...base, format: "VIRTUAL", source_platform: "Microsoft Reactor" })).toBeNull();
  });

  it("drops events held outside Africa", () => {
    expect(audienceProblem({ ...base, city: "Overland Park, KS" })).toBe("located outside Africa");
    expect(audienceProblem({ ...base, country: "US" })).toBe("located outside Africa");
    expect(audienceProblem({ ...base, country: "United States" })).toBe("located outside Africa");
    expect(audienceProblem({ ...base, city: "London", country: "GB" })).toBe("located outside Africa");
  });

  it("drops online events run by a foreign local chapter", () => {
    expect(
      audienceProblem({ ...base, format: "VIRTUAL", title: "GDG Kansas City: DevFest online", organizer: "GDG Kansas City" }),
    ).toBe("located outside Africa");
  });

  it("drops events limited to US or other foreign attendees", () => {
    const problem = "restricted to a region outside Africa";
    expect(audienceProblem({ ...base, format: "VIRTUAL", description: "Free AI skills webinar. USA only." })).toBe(problem);
    expect(audienceProblem({ ...base, format: "VIRTUAL", description: "Open to US residents aged 18+." })).toBe(problem);
    expect(audienceProblem({ ...base, format: "VIRTUAL", description: "You must be located in the United States." })).toBe(problem);
    expect(audienceProblem({ ...base, format: "VIRTUAL", description: "Only open to residents of Canada." })).toBe(problem);
  });

  it("does not read 'us' as the United States", () => {
    expect(audienceProblem({ ...base, format: "VIRTUAL", description: "Join us only if you can stay for the demo; contact us based on your track." })).toBeNull();
  });

  it("drops in-person events with no venue from worldwide listings only", () => {
    expect(audienceProblem({ ...base, source_platform: "Microsoft Reactor" })).toBe("no African venue");
    expect(audienceProblem(base)).toBeNull();
  });

  it("always keeps our own events", () => {
    expect(audienceProblem({ ...base, is_featured: true, country: "US" })).toBeNull();
  });
});

describe("countryCode", () => {
  it("reads codes and names", () => {
    expect(countryCode("ng")).toBe("NG");
    expect(countryCode("NGA")).toBe("NG");
    expect(countryCode("Nigeria")).toBe("NG");
    expect(countryCode("United States")).toBe("US");
    expect(countryCode("UK")).toBe("GB");
    expect(countryCode("")).toBeNull();
  });
});
