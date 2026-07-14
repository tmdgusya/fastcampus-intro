import { describe, expect, it } from "vitest";
import { products } from "./products";

// PRD 기반 데이터 불변식 검증. 상품 개수·이름·확장자에 의존하지 않고
// 모든 브랜치에서 지켜져야 하는 규칙만 확인한다.
describe("products 데이터 불변식", () => {
  it("상품이 하나 이상 존재한다", () => {
    expect(products.length).toBeGreaterThan(0);
  });

  it("모든 id 가 고유하다", () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("모든 상품이 필수 필드를 비어 있지 않은 값으로 가진다", () => {
    for (const p of products) {
      expect(typeof p.id).toBe("string");
      expect(p.id.trim().length).toBeGreaterThan(0);
      expect(p.name.trim().length).toBeGreaterThan(0);
      expect(p.description.trim().length).toBeGreaterThan(0);
    }
  });

  it("모든 price 가 양의 정수이다", () => {
    for (const p of products) {
      expect(Number.isInteger(p.price)).toBe(true);
      expect(p.price).toBeGreaterThan(0);
    }
  });

  it("모든 imageUrl 이 로컬 /images/ 경로이다", () => {
    for (const p of products) {
      expect(p.imageUrl.startsWith("/images/")).toBe(true);
    }
  });
});
