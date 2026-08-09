import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/products", () => {
  it("6개 상품을 JSON 배열로 응답한다", async () => {
    const res = await GET();

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(6);
  });

  it("첫 상품은 PRD의 미니멀 화이트 머그컵(id=1)이다", async () => {
    const res = await GET();
    const body = await res.json();

    expect(body[0]).toMatchObject({
      id: "1",
      name: "미니멀 화이트 머그컵",
      price: 12000,
      imageUrl: "/images/product-01.png",
    });
  });
});