import { describe, expect, it } from "vitest";
import { paymentReturnState } from "@/lib/service-payment-return";

describe("service page payment return", () => {
  it("shows paid only when Flutterwave reports success", () => {
    expect(paymentReturnState("?paid=1&status=successful&tx_ref=brief-1")).toBe("paid");
  });
  it("treats a cancelled payment as not paid", () => {
    expect(paymentReturnState("?paid=1&status=cancelled&tx_ref=brief-1")).toBe("unpaid");
  });
  it("treats a failed payment as not paid", () => {
    expect(paymentReturnState("?paid=1&status=failed")).toBe("unpaid");
  });
  it("treats a missing status as not paid", () => {
    expect(paymentReturnState("?paid=1")).toBe("unpaid");
  });
  it("shows the form when not returning from payment", () => {
    expect(paymentReturnState("")).toBeNull();
  });
});
