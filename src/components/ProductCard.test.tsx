import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductCard from "./ProductCard";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/data/products";

const sample: Product = {
  id: "42",
  name: "테스트 상품",
  price: 34000,
  imageUrl: "/images/product-42.png",
  description: "테스트용 상품 설명",
};

describe("ProductCard", () => {
  it("상품명을 렌더한다", () => {
    render(<ProductCard product={sample} />);
    expect(screen.getByText("테스트 상품")).toBeInTheDocument();
  });

  it("formatPrice 로 포맷한 가격을 렌더한다", () => {
    render(<ProductCard product={sample} />);
    expect(screen.getByText(formatPrice(sample.price))).toBeInTheDocument();
  });

  it("카드 전체가 상세 페이지로 연결된다", () => {
    render(<ProductCard product={sample} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/42");
  });

  it("이미지 alt 로 상품명을 제공한다", () => {
    render(<ProductCard product={sample} />);
    expect(screen.getByAltText("테스트 상품")).toBeInTheDocument();
  });
});
