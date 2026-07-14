import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("천 단위 구분 쉼표와 '원' 접미사를 붙인다", () => {
    expect(formatPrice(12000)).toBe("12,000원");
  });

  it("십만 단위 이상도 천 단위마다 쉼표를 넣는다", () => {
    expect(formatPrice(289000)).toBe("289,000원");
    expect(formatPrice(1234567)).toBe("1,234,567원");
  });

  it("천 미만 값에는 쉼표를 넣지 않는다", () => {
    expect(formatPrice(0)).toBe("0원");
    expect(formatPrice(999)).toBe("999원");
  });
});
