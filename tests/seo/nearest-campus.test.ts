import { describe, expect, it } from "vitest";
import { nearestCampus } from "../../src/hooks/use-device-location";

describe("nearestCampus", () => {
  it("picks the Nnewi centre for a point in Nnewi", () => {
    expect(nearestCampus(6.0186, 6.9147).campus.city).toBe("Nnewi");
  });
  it("picks the Enugu centre for a point in Enugu", () => {
    expect(nearestCampus(6.45, 7.51).campus.city).toBe("Enugu");
  });
});
