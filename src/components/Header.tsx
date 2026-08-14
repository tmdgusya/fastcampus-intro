import Link from "next/link";

/**
 * 공통 헤더. 사이트명 "패캠 스토어"를 좌측에 노출하고, 클릭 시 `/products` 로 이동한다.
 * 디자인 토큰: --header-bg / --header-brand-text / --shadow-xs / space-4 패딩
 */
export default function Header() {
  return (
    <header className="bg-(--header-bg) shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-4">
        <Link
          href="/products"
          className="-my-2 py-2 text-2xl font-bold tracking-tight text-(--header-brand-text)"
        >
          패캠 스토어
        </Link>
      </div>
    </header>
  );
}
