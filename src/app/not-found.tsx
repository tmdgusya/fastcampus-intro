import Link from "next/link";

/**
 * 404 화면. 존재하지 않는 경로·상품 접근 시 노출된다.
 * 디자인 토큰 매트릭스: 404(bg-primary / text-secondary / space-12).
 */
export default function NotFound() {
  return (
    <div className="min-h-full bg-(--color-bg-primary)">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-12 text-center">
        <h1 className="text-2xl font-bold leading-tight text-(--color-text-secondary)">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-sm leading-normal text-(--color-text-secondary)">
          요청하신 페이지가 존재하지 않거나 삭제되었습니다.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex min-h-11 items-center rounded-sm bg-(--btn-primary-bg) px-4 text-sm font-semibold text-(--btn-primary-text) transition-colors hover:bg-(--btn-primary-bg-hover)"
        >
          상품 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
