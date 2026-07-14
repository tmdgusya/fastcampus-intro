import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { createElement, type ReactNode } from "react";

// next/image, next/link 는 jsdom 환경에서 그대로 렌더할 수 없으므로
// 테스트에서는 접근성/링크 계약(alt, href)만 검증할 수 있는 순수 DOM 요소로 대체한다.
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) =>
    createElement("img", { src, alt }),
}));

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) =>
    createElement("a", { href }, children),
}));

// 각 테스트 후 렌더 트리를 정리해 테스트 간 DOM 오염을 막는다.
afterEach(() => {
  cleanup();
});
