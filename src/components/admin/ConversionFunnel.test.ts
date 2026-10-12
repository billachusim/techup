import { describe, expect, it } from "vitest";
import { percent } from "./ConversionFunnel";

describe("percent", () => {
  it("rounds to a whole percentage", () => {
    expect(percent(1, 3)).toBe("33%");
    expect(percent(2, 2)).toBe("100%");
  });
  it("shows a dash when there is nothing to divide by", () => {
    expect(percent(0, 0)).toBe("—");
  });
});
