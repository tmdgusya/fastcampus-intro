import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
        <Link href="/products" className="text-xl font-bold text-zinc-900">
          패캠 스토어
        </Link>
      </div>
    </header>
  );
}
