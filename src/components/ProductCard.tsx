import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-3 px-0.5">
        <h2 className="line-clamp-2 min-h-[2.6em] text-[13px] leading-snug text-neutral-700">
          {product.name}
        </h2>
        <p className="mt-1.5 text-[15px] font-semibold tracking-tight text-neutral-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
