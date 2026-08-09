import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/products/:id", () => {
  it("존재하는 id의 상품을 반환한다", async () => {
    const res = await GET(new Request("http://localhost/api/products/1"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      id: "1",
      name: "미니멀 화이트 머그컵",
      price: 12000,
      imageUrl: "/images/product-01.png",
    });
  });

  it("존재하지 않는 id는 404와 한글 에러 메시지를 반환한다", async () => {
    const res = await GET(new Request("http://localhost/api/products/999"), {
      params: Promise.resolve({ id: "999" }),
    });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("해당 상품을 찾을 수 없습니다.");
  });
});