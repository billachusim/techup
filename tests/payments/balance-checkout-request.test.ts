import { describe, expect, it, vi } from "vitest";
import { createBalanceCheckoutRequest } from "../../src/lib/balance-checkout-request";

describe("balance checkout request", () => {
  it("reuses one request when the payment-page effect runs twice", async () => {
    const request = vi.fn(async () => ({ url: "https://checkout.flutterwave.test/payment" }));
    const checkout = createBalanceCheckoutRequest(request);
    const first = checkout("test-link");
    const replay = checkout("test-link");
    expect(first).toBe(replay);
    await Promise.all([first, replay]);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("requests a different checkout when the payment link changes", async () => {
    const request = vi.fn(async (token: string) => token);
    const checkout = createBalanceCheckoutRequest(request);
    expect(await checkout("first-link")).toBe("first-link");
    expect(await checkout("second-link")).toBe("second-link");
    expect(request).toHaveBeenCalledTimes(2);
  });
});