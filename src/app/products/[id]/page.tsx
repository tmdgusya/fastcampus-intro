import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

/** 상품 6개 경로를 정적 생성한다. (`/products/1` … `/products/6`) */
export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return { title: "상품을 찾을 수 없습니다 | 패캠 스토어" };
  }
  return { title: `${product.name} | 패캠 스토어` };
}

/**
 * 상품 상세 페이지 (`/products/[id]`).
 * 2단 레이아웃(데스크톱 좌 이미지 · 우 정보), 모바일은 세로 스택.
 * 디자인 토큰 매트릭스: 상세이미지(bg-surface / radius-lg / shadow-md),
 * 가격강조(brand-primary), 목록돌아가기(bg-brand / text-on-brand / radius-sm).
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-full bg-(--color-bg-subtle)">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/products"
          className="inline-flex min-h-11 items-center rounded-sm bg-(--btn-primary-bg) px-4 text-sm font-semibold text-(--btn-primary-text) transition-colors hover:bg-(--btn-primary-bg-hover)"
        >
          목록으로 돌아가기
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-(--color-bg-surface) shadow-md">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold leading-tight text-(--color-text-primary)">
              {product.name}
            </h1>
            <p className="mt-4 text-xl font-bold leading-tight text-(--color-brand-primary)">
              {formatPrice(product.price)}
            </p>
            <p className="mt-6 text-base leading-relaxed text-(--color-text-secondary)">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
