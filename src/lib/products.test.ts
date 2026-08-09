import { describe, expect, it } from "vitest";
import { getProductById, getProducts } from "./products";

describe("getProducts", () => {
  it("PRD의 6개 상품을 id 순으로 반환한다", async () => {
    const products = await getProducts();

    expect(products).toHaveLength(6);
    expect(products[0].id).toBe("1");
    expect(products[products.length - 1].id).toBe("6");
  });

  it("각 상품은 이름·가격·이미지·설명 필드를 정상적으로 가진다", async () => {
    const products = await getProducts();

    for (const product of products) {
      expect(product).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number),
        imageUrl: expect.stringMatching(/^\/images\//),
        description: expect.any(String),
      });
    }
  });
});

describe("getProductById", () => {
  it("존재하는 id의 상품을 반환한다", async () => {
    const product = await getProductById("1");

    expect(product).not.toBeNull();
    expect(product?.name).toBe("미니멀 화이트 머그컵");
    expect(product?.price).toBe(12000);
  });

  it("존재하지 않는 id는 null을 반환한다", async () => {
    const product = await getProductById("999");

    expect(product).toBeNull();
  });
});