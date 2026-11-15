import { describe, expect, it } from "vitest";
import { nigerianState } from "../../src/lib/visitor-state";

describe("nigerianState", () => {
  it("maps Cloudflare region names to state names", () => {
    expect(nigerianState("NG", "Anambra")).toBe("Anambra");
    expect(nigerianState("NG", "Enugu State")).toBe("Enugu");
    expect(nigerianState("NG", "Ebonyi")).toBe("Ebonyi");
    expect(nigerianState("NG", "Lagos")).toBe("Lagos");
    expect(nigerianState("NG", "Akwa Ibom State")).toBe("Akwa Ibom");
    expect(nigerianState("NG", "Federal Capital Territory")).toBe("Abuja");
  });

  it("returns null outside Nigeria or for unknown regions", () => {
    expect(nigerianState("US", "Texas")).toBeNull();
    expect(nigerianState("NG", undefined)).toBeNull();
    expect(nigerianState("NG", "Somewhere")).toBeNull();
  });
});

describe("foreignCountry and countryName", () => {
  it("keeps real foreign countries only", async () => {
    const { foreignCountry, countryName } =
      await import("../../src/lib/visitor-state");
    expect(foreignCountry("US")).toBe("US");
    expect(foreignCountry("NG")).toBeNull();
    expect(foreignCountry("XX")).toBeNull();
    expect(foreignCountry("T1")).toBeNull();
    expect(countryName("US")).toBe("the United States");
    expect(countryName("GH")).toBe("Ghana");
  });
});
