import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const SUB_CATEGORIES = ["전체", "아우터", "상의", "하의", "원피스", "가방", "신발", "액세서리"] as const;

export default function ProductListPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* 페이지 타이틀 */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-[0.3em] text-neutral-900">WOMEN</h1>
        <p className="mt-2 text-[12px] tracking-wide text-neutral-400">
          감각적인 무드의 이번 시즌 여성 패션 큐레이션
        </p>
      </div>

      {/* 서브카테고리 탭 바 (시각용) */}
      <nav className="mb-6 overflow-x-auto">
        <ul className="flex items-center justify-center gap-6 whitespace-nowrap text-[13px] text-neutral-500">
          {SUB_CATEGORIES.map((cat, i) => (
            <li key={cat}>
              <span
                className={
                  i === 0
                    ? "font-semibold text-neutral-900"
                    : "cursor-default transition-colors hover:text-neutral-900"
                }
              >
                {cat}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      {/* 정렬 옵션 바 (시각용) */}
      <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-3">
        <span className="text-[12px] text-neutral-500">총 {products.length}개의 상품</span>
        <span className="cursor-default text-[12px] text-neutral-500">신상품순 ▾</span>
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
