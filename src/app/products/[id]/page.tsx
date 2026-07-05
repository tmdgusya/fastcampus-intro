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
      <Link
        href="/products"
        className="mb-6 inline-block text-sm text-zinc-600 hover:text-zinc-900"
      >
        ← 목록으로 돌아가기
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-zinc-900">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-zinc-900">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 leading-relaxed text-zinc-600">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
