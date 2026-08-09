import type { Product } from "../../generated/prisma/client";
import { prisma } from "./prisma";

/** 전체 상품을 id 순으로 조회한다. */
export async function getProducts(): Promise<Product[]> {
  return prisma.product.findMany({ orderBy: { id: "asc" } });
}

/** 단일 상품을 id로 조회한다. 없으면 `null`을 반환한다. */
export async function getProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}