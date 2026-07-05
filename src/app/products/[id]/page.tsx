import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* 브레드크럼 */}
      <nav className="mb-6 text-[12px] tracking-wide text-neutral-400">
        <ol className="flex items-center gap-2">
          <li>HOME</li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/products" className="transition-colors hover:text-neutral-700">
              WOMEN
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="truncate text-neutral-600">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* 좌측 대형 이미지 */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* 우측 상품 정보 */}
        <div className="flex flex-col">
          <h1 className="text-[22px] font-medium leading-snug text-neutral-900">
            {product.name}
          </h1>
          <p className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 text-[14px] leading-relaxed text-neutral-600">
            {product.description}
          </p>

          {/* 액션 버튼 (시각용) */}
          <div className="mt-8 flex flex-col gap-2">
            <button
              type="button"
              className="h-12 w-full bg-neutral-900 text-[14px] font-medium tracking-wide text-white transition-colors hover:bg-neutral-700"
            >
              장바구니 담기
            </button>
            <button
              type="button"
              className="h-12 w-full border border-neutral-300 bg-white text-[14px] font-medium tracking-wide text-neutral-900 transition-colors hover:border-neutral-900"
            >
              바로 구매하기
            </button>
          </div>
        </div>
      </div>

      {/* 목록으로 돌아가기 */}
      <Link
        href="/products"
        className="mt-10 inline-block text-[13px] text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline"
      >
        ← 목록으로 돌아가기
      </Link>
    </div>
  );
}
