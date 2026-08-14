import type { Metadata } from "next";

import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "상품 목록 | 패캠 스토어",
};

/**
 * 상품 목록 페이지 (`/products`).
 * `src/data/products.ts` 의 정적 배열을 직접 import 해 그리드로 렌더링한다.
 * (fetch/API 사용 안 함) 모바일 1열 / 태블릿 2열 / 데스크톱 3열.
 */
export default function ProductsPage() {
  return (
    <div className="min-h-full bg-(--color-bg-subtle)">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold leading-tight text-(--color-text-primary)">
          상품 목록
        </h1>
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
