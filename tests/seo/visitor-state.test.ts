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
