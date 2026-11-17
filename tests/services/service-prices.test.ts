import { describe, expect, it } from "vitest";
import { SERVICES, businessPrice } from "../../src/data/services";
import { SERVICE_PRICES } from "../../supabase/functions/_shared/service-prices";

describe("shared service prices", () => {
  it("match the service pages (run scripts/generate-service-prices.ts after a price change)", () => {
    expect(Object.keys(SERVICE_PRICES).sort()).toEqual(
      SERVICES.map((s) => s.slug).sort(),
    );
    for (const s of SERVICES) {
      expect(SERVICE_PRICES[s.slug], s.slug).toEqual({
        name: s.name,
        price: businessPrice(s),
        unit: s.unit,
      });
    }
  });
});
