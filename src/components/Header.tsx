import Link from "next/link";

const CATEGORIES = ["WOMEN", "MAN", "BEAUTY", "LIFE", "BEST", "NEW"] as const;

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      {/* 상단 유틸리티 바 */}
      <div className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4 text-[11px] text-neutral-500">
          <span className="tracking-wide">전 상품 무료배송 · 5만원 이상 구매 시 사은품 증정</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">로그인</span>
            <span className="hidden sm:inline">주문조회</span>
            <span className="hidden sm:inline">위시리스트</span>
            <span>고객센터</span>
          </div>
        </div>
      </div>

      {/* 메인 바 */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/products"
          className="text-lg font-semibold tracking-[0.2em] text-neutral-900"
        >
          ROACH SHOP
        </Link>

        <div className="flex items-center gap-5 text-neutral-700">
          {/* 검색 아이콘 (시각용) */}
          <span aria-hidden className="cursor-default">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          {/* 위시 아이콘 (시각용) */}
          <span aria-hidden className="hidden cursor-default sm:inline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" strokeLinejoin="round" />
            </svg>
          </span>
          {/* 장바구니 아이콘 (시각용) */}
          <span aria-hidden className="cursor-default">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
              <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* 카테고리 네비게이션 바 */}
      <nav className="border-t border-neutral-100">
        <ul className="mx-auto flex h-11 max-w-6xl items-center gap-6 px-4 text-[13px] tracking-wider text-neutral-700">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link
                href="/products"
                className="font-medium text-neutral-900 transition-colors hover:text-neutral-500"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
