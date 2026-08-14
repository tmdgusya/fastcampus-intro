import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: Product;
}

/**
 * 상품 카드. 카드 전체가 상품 상세(`/products/[id]`)로 이동하는 링크다.
 * 디자인 토큰: --card-bg / --card-border / --card-name / --card-price / --card-image-bg,
 *             --radius-md / --shadow-md(hover --shadow-lg) / space-4 패딩
 */
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex h-full flex-col rounded-md border border-(--card-border) bg-(--card-bg) p-4 shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-(--card-image-bg)">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <h2 className="mt-4 text-md font-semibold text-(--card-name)">{product.name}</h2>
      <p className="mt-2 text-md font-bold leading-tight text-(--card-price)">
        {formatPrice(product.price)}
      </p>
    </Link>
  );
}
