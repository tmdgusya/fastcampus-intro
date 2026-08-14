import { redirect } from "next/navigation";

/** 홈(`/`)은 상품 목록(`/products`)으로 리다이렉트한다. */
export default function HomePage() {
  redirect("/products");
}
