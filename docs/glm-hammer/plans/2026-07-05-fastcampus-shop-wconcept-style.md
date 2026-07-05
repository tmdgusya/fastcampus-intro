# FASTCAMPUS SHOP — W컨셉 women 스타일 패션 커머스 개편

## Goal

기존 "패캠 스토어" 잡화 쇼핑몰을 "FASTCAMPUS SHOP" 패션 커머스로 개편하여, W컨셉 women 페이지의 감각적 카드형 그리드·미니멀 타이포그래피·세련된 헤더 톤앤매너를 구현한다. 단, **데이터 모델(Product 타입)과 로컬 이미지 규칙, 한글 텍스트 규칙은 그대로 유지**한다.

## Architecture

Next.js 16 App Router + TypeScript(strict) + Tailwind CSS v4 의 기존 구조를 그대로 사용한다. 변경은 **프레젠테이션 계층(헤더/카드/목록/상세 레이아웃)과 데이터 배열의 내용(잡화→패션)** 에 한정한다. 데이터 흐름(SSOT: `src/data/products.ts` → import → 렌더)과 라우팅(`/`, `/products`, `/products/[id]`), `formatPrice` 규칙은 변경하지 않는다. W컨셉 스타일은 Tailwind 유틸리티 클래스와 `globals.css` 토큰만으로 표현하며, 외부 UI 라이브러리는 추가하지 않는다.

## Tech Stack (변경 없음)

- Next.js 16.2.9 (App Router), React 19.2.4
- TypeScript 5 (strict, `any` 금지)
- Tailwind CSS v4 (`@import "tailwindcss"`, PostCSS)
- 패키지 매니저: pnpm
- 이미지: `next/image`, 로컬 경로(`/images/...`)만

## Work Scope

### In (범위 내)
- 사이트명 "패캠 스토어" → **"FASTCAMPUS SHOP"** 으로 변경 (Header, layout metadata, PRD 표시명).
- `Product` 데이터 배열 내용을 잡화 6종 → **패션 8종**(상의/하의/원피스/아우터/가방/신발/액세서리)으로 교체. `id`는 `"1"~"8"`, 한국어 name/description.
- placeholder 이미지 8종(패션 무드 단색/그라데이션 SVG)을 `public/images/` 에 생성, 기존 PNG 6종은 삭제.
- `globals.css` 디자인 토큰(배경/포그라운드/폰트)을 W컨셉풍 미니멀 톤(#fff 배경, #111 텍스트, 시스템 sans)으로 조정. **다크모드 미디어쿼리 제거** (W컨셉은 라이트 고정).
- `Header` 재디자인: 상단 유틸리티 바(배송/멤버십 더미 링크) + 메인 바(로고 "FASTCAMPUS SHOP" + 더미 카테고리 메뉴 + 검색 아이콘/장바구니 아이콘). 모두 시각용(동작 X, `href="/products"` 또는 비활성).
- `ProductCard` 재디자인: W컨셉풍 — 테두리 없는 이미지(3:4 세로 비율), 호버 시 이미지 확대, 브랜드명 대신 name 상단 작은 캡션(없으므로 생략 가능), name(트렁케이트 2줄), price 우측 정렬 또는 name 하단. **데이터 모델 제약상 브랜드명·할인가는 표시하지 않는다**.
- `products/page.tsx` 재디자인: 페이지 상단 "WOMEN" 스타일 페이지 타이틀 + 서브카테고리 탭 바(시각만, `button` 비활성/현재 탭 강조), 상단 정렬 옵션 바(시각만). 그리드는 모바일 2열 / 데스크톱 4열로 W컨셉 밀도에 맞게 조정.
- `products/[id]/page.tsx` 재디자인: W컨셉 상세풍 — 좌측 대형 이미지(3:4), 우측 name(대형), price, description, 그 아래 "장바구니 담기"/"구매하기" **시각용 버튼**(동작 X, `<button>` 요소), 상단 breadcrumbs("HOME > WOMEN > 상품명").
- `layout.tsx` metadata(title/description) 한글 + "FASTCAMPUS SHOP" 반영.
- 상단 `page.tsx` 는 기존대로 `/products` 리다이렉트 유지.
- `CLAUDE.md`, `docs/prd/*` 의 사이트명/샘플 데이터를 새 카탈로그에 맞게 동기화(규칙은 유지, 데이터 표만 갱신).

### Out (범위 외 — 명시적으로 금지)
- `Product` 인터페이스 필드 추가/변경 (brand, originalPrice, badge, color, size, rating 등 일절 추가 안 함).
- 실제 필터링·정렬 로직, 검색 기능, 장바구니·결제, 로그인/API/DB.
- 외부 이미지(remotePatterns, Unsplash 등). 로컬 SVG만.
- 다크모드.
- 새로운 npm 의존성 추가.
- 테스트 프레임워크 도입 (기존에도 없음).

## Verification Strategy

**Level: build-only + lint** (기존 프로젝트에 테스트 프레임워크가 없으므로).

명령:
```bash
pnpm lint    # ESLint 통과 (eslint-config-next)
pnpm build   # next build 성공 (정적 생성 generateStaticParams 8개 경로 포함)
```

**passing이 증명하는 것:**
- TypeScript strict 타입 검사 통과 (`any` 없음, 명시적 타입).
- `next/image` 의 모든 `src` 가 허용된 로컬 경로(에러 없음).
- 8개 상품 경로가 정적 생성됨 (`generateStaticParams` 가 `products.map` 반환).
- ESLint 규칙(react, next) 위반 없음.
- 빌드 산출물에 404 페이지 포함(존재하지 않는 id → notFound).

수동 검증(선택, 빌드 후): `pnpm start` 후 `/products` 에서 8개 카드 표시, 카드 클릭 시 `/products/[id]` 이동, `/products/999` → 404, "목록으로 돌아가기" 동작.

## File Structure Mapping

| 파일 | 작업 | 앵커(심볼) |
|---|---|---|
| `src/data/products.ts` | Modify | `interface Product`, `export const products` |
| `src/app/globals.css` | Modify | `:root`, `@theme inline`, `body`, dark `@media` |
| `src/app/layout.tsx` | Modify | `metadata`, `RootLayout` |
| `src/components/Header.tsx` | Rewrite | default export `Header` |
| `src/components/ProductCard.tsx` | Rewrite | default export `ProductCard`, `ProductCardProps` |
| `src/app/products/page.tsx` | Rewrite | default export `ProductListPage` |
| `src/app/products/[id]/page.tsx` | Rewrite | `generateStaticParams`, `ProductDetailPageProps`, default export `ProductDetailPage` |
| `src/app/page.tsx` | No change | (`redirect("/products")` 유지) |
| `public/images/product-01.png` ~ `product-06.png` | Delete | — |
| `public/images/product-01.svg` ~ `product-08.svg` | Create | — |
| `CLAUDE.md` | Modify | 사이트명·샘플 데이터 표 |
| `docs/prd/README.md` | Modify | 사이트명·샘플 데이터 표(6→8) |
| `docs/prd/feature-01-product-list.md` | Modify | 사이트명, 그리드 열 수(3→4), 카드 요소 |
| `docs/prd/feature-02-product-detail.md` | Modify | 사이트명, 브레드크럼/버튼 등 UI 요소 |

`format.ts`(`formatPrice`), `src/app/page.tsx`(`redirect`), `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `package.json` — **변경 없음**.

---

## Task 1: 패션 placeholder SVG 8종 생성 및 기존 PNG 삭제

**Goal:** `public/images/product-01.svg` ~ `product-08.svg` 패션 무드 단색/그라데이션 placeholder 8종을 생성하고, 기존 `product-01.png` ~ `product-06.png` 6종을 삭제한다.

**Dependencies:** None (독립, 다른 작업과 병렬 가능하지만 가장 먼저 수행 권장).

**Files:**
- Create: `public/images/product-01.svg` … `public/images/product-08.svg`
- Delete: `public/images/product-01.png` … `public/images/product-06.png`

**Acceptance Criteria:**
- [ ] `ls public/images/` 출력이 `product-01.svg` ~ `product-08.svg` 8개만 포함하고 `.png` 파일이 0개이다.
- [ ] 각 SVG는 유효한 XML이며 `viewBox` 를 포함하고(3:4 세로 비율 권장 `0 0 300 400`), `width`/`height` 없이 `viewBox` 만으로 스케일링 가능하다.
- [ ] SVG 파일에 `<image>` 외부 참조(`href="http..."`)가 없다 (로컬 규칙 준수).

**Steps:**

**Step 1:** 기존 PNG 6종 삭제.
```bash
rm public/images/product-01.png public/images/product-02.png public/images/product-03.png \
   public/images/product-04.png public/images/product-05.png public/images/product-06.png
```
예상 출력: 에러 없음. `ls public/images/*.png` → "No such file or directory".

**Step 2:** 8개 SVG 파일 생성. 각 파일은 W컨셉풍 파스텔/뉴트럴 그라데이션 + 중앙에 상품을 상징하는 간단한 라인 아이콘(의류/가방/신발 실루엣) 또는 상품명 앞글자. 색상 팔레트(파일별):
- 01: 베이지→크림 (#E8DCC8 → #F5EFE6), 아우터 실루엣
- 02: 더스티 핑크 (#E5C6C0 → #F0DDDA), 니트 실루엣
- 03: 세이지 그린 (#C9D4C5 → #DDE6DA), 원피스 실루엣
- 04: 라벤더 그레이 (#C8C6D3 → #DDDBE6), 셔츠 실루엣
- 05: 샌드 (#D9C9A8 → #ECE2C9), 트렌치코트 실루엣
- 06: 스카이 그레이 (#BFC9D1 → #D7DEE3), 가방 실루엣
- 07: 무드 (#D4BFA8 → #E8D9C7), 구두 실루엣
- 08: 콜드 그레이 (#C3C3C3 → #DDDDDD), 스카프/액세서리 실루엣

각 파일의 공통 템플릿(예: `product-01.svg`):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" role="img" aria-label="패션 상품 이미지">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8DCC8"/>
      <stop offset="100%" stop-color="#F5EFE6"/>
    </linearGradient>
  </defs>
  <rect width="300" height="400" fill="url(#g)"/>
  <!-- 중앙 라인 아이콘(예: 아우터 실루엣) -->
  <g fill="none" stroke="#9A8C7A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="translate(100,140)">
    <path d="M20 10 L0 30 L10 40 L10 110 L90 110 L90 40 L100 30 L80 10 L60 10 Q50 25 40 10 Z"/>
    <path d="M40 10 Q50 22 60 10"/>
  </g>
</svg>
```
8개 모두 동일 구조, `stop-color` 와 `<g>` 의 path 만 상이. aria-label 은 고정("패션 상품 이미지") — 실제 alt 텍스트는 `next/image` 의 `alt` prop 으로 상품명이 전달된다.

**Step 3:** 결과 확인.
```bash
ls public/images/
```
예상 출력: `product-01.svg  product-02.svg  ...  product-08.svg` (8행).

---

## Task 2: 상품 데이터 배열을 패션 8종으로 교체

**Goal:** `src/data/products.ts` 의 `products` 배열 내용을 잡화 6종 → 패션 8종으로 교체한다. `interface Product`는 **필드를 변경하지 않고** 그대로 유지한다.

**Dependencies:** Task 1 (이미지 파일명이 `product-NN.svg` 로 고정되어야 `imageUrl` 지정 가능).

**Files:**
- Modify: `src/data/products.ts` (anchor: `interface Product` 유지, `export const products` 내용 교체)

**Acceptance Criteria:**
- [ ] `interface Product { id: string; name: string; price: number; imageUrl: string; description: string; }` — 필드 추가/삭제/이름변경 없이 원본과 동일.
- [ ] `products` 배열 길이 === 8.
- [ ] 모든 `imageUrl` 이 `/images/product-0[1-8].svg` 형식이고 `task-1` 에서 생성한 파일과 1:1 대응.
- [ ] 모든 `id` 가 문자열 `"1"`~`"8"` 이고 고유.
- [ ] 모든 `price` 가 정수이고 10000 이상 1000000 이하.
- [ ] 모든 `name`·`description` 이 한글이고 비어 있지 않다.
- [ ] `pnpm lint` 통과.

**Steps:**

**Step 1:** `src/data/products.ts` 의 `products` 배열을 아래 내용으로 전체 교체(`interface Product` 블록은 그대로).

```ts
export const products: Product[] = [
  {
    id: "1",
    name: "오버핏 울 블렌드 아우터",
    price: 289000,
    imageUrl: "/images/product-01.svg",
    description:
      "넉넉한 오버핏 실루엣의 울 블렌드 아우터입니다. 흐르는 듯 자연스러운 핏으로 일상적인 레이어링에 적합합니다. 부드러운 텍스처가 닿는 순간부터 편안함을 전합니다.",
  },
  {
    id: "2",
    name: "하이넥 케이블 니트",
    price: 89000,
    imageUrl: "/images/product-02.svg",
    description:
      "클래식한 케이블 패턴의 하이넥 니트입니다. 골지 짜임의 하이넥이 목선을 따뜻하게 감싸줍니다. 베이직한 데님과 함께 겨울 내내 부담 없이 입기 좋습니다.",
  },
  {
    id: "3",
    name: "플로럴 롱 원피스",
    price: 159000,
    imageUrl: "/images/product-03.svg",
    description:
      "은은한 플로럴 패턴이 흐르는 롱 기장 원피스입니다. 가벼운 소재가 바람에 자연스럽게 흩날려 여름부터 초가을까지 다양하게 활용할 수 있습니다.",
  },
  {
    id: "4",
    name: "와이드 버튼다운 셔츠",
    price: 79000,
    imageUrl: "/images/product-04.svg",
    description:
      "여유로운 와이드 핏의 버튼다운 셔츠입니다. 산뜻한 코튼 혼방 원단으로 통기성이 좋고, 단추를 풀어 레이어링하면 캐주얼한 무드까지 연출할 수 있습니다.",
  },
  {
    id: "5",
    name: "벨트 트렌치 코트",
    price: 320000,
    imageUrl: "/images/product-05.svg",
    description:
      "웨이스트 벨트로 실루엣을 조절할 수 있는 트렌치 코트입니다. 클래식한 더블 버튼 디테일과 떨어지는 핏이 스타일리시한 첫인상을 만들어 줍니다. 봄·가을 환절기 아우터로 제격입니다.",
  },
  {
    id: "6",
    name: "미니멀 크로스백",
    price: 119000,
    imageUrl: "/images/product-06.svg",
    description:
      "깔끔한 선의 미니멀 크로스백입니다. 가볍고 내구성 좋은 소재로 제작되어 데일리 백으로 부담 없이 사용할 수 있습니다. 조절 가능한 스트랩으로 사이즈에 맞게 착용하세요.",
  },
  {
    id: "7",
    name: "포인트토 로퍼",
    price: 139000,
    imageUrl: "/images/product-07.svg",
    description:
      "날렵한 포인트토가 특징인 로퍼입니다. 부드러운 합성 가죽으로 제작되어 오래 신어도 편안합니다. 슬랙스부터 데님까지 다양한 하의와 매치하기 좋습니다.",
  },
  {
    id: "8",
    name: "실크 스카프 랩",
    price: 49000,
    imageUrl: "/images/product-08.svg",
    description:
      "실크 블렌드 원단의 가벼운 스카프입니다. 은은한 광택과 부드러운 촉감으로 목이나 헤어에 두르면 포인트가 됩니다. 작은 사이즈로 언제든 가볍게 연출할 수 있습니다.",
  },
];
```

**Step 2:** 타입/린트 확인.
```bash
pnpm lint
```
예상 출력: 에러 없음(`✔ No problems found!` 또는 동등 메시지).

---

## Task 3: globals.css 디자인 토큰을 W컨셉풍 라이트 톤으로 조정

**Goal:** `globals.css` 의 색상 토큰과 다크모드 미디어쿼리를 정리하여 W컨셉풍 미니멀 라이트(#fff/#111) 고정 톤으로 만든다.

**Dependencies:** None (독립).

**Files:**
- Modify: `src/app/globals.css` (anchor: `:root`, `@theme inline`, `body`, dark `@media`)

**Acceptance Criteria:**
- [ ] 파일 내 `@media (prefers-color-scheme: dark)` 블록이 존재하지 않는다.
- [ ] `:root` 의 `--background` 가 `#ffffff`, `--foreground` 가 `#111111`.
- [ ] `body` 에 `font-family` 가 명시되어 있지 않거나 시스템 sans 스택(`-apple-system, BlinkMacSystemFont, "Segoe UI", ...`)이다. (Tailwind v4 기본 sans 활용 허용)
- [ ] `pnpm build` 성공.

**Steps:**

**Step 1:** `src/app/globals.css` 전체를 아래로 교체.

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #111111;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  -webkit-font-smoothing: antialiased;
}
```

> 다크모드 `@media (prefers-color-scheme: dark)` 블록 제거. `font-family` 는 Tailwind v4 기본 sans(`@theme inline` 의 `--font-sans`)를 따르도록 body 에서 명시 제거. dark 토큰 `--background:#0a0a0a`/`--foreground:#ededed` 삭제.

**Step 2:** 빌드 확인(이후 Task 들과 함께 최종 빌드에서 재확인).
```bash
pnpm build
```
예상: 성공 (CSS 파싱 에러 없음).

---

## Task 4: layout.tsx metadata 및 body 클래스를 FASTCAMPUS SHOP으로 갱신

**Goal:** 루트 레이아웃의 `metadata`(title/description)와 body 스타일 클래스를 "FASTCAMPUS SHOP" 패션 커머스 톤으로 갱신한다.

**Dependencies:** None (독립).

**Files:**
- Modify: `src/app/layout.tsx` (anchor: `metadata`, `RootLayout`)

**Acceptance Criteria:**
- [ ] `metadata.title` 이 `"FASTCAMPUS SHOP"` 를 포함한다.
- [ ] `metadata.description` 이 한글이고 패션 커머스 성격을 설명한다.
- [ ] `<body>` 의 className 이 W컨셉풍 라이트 배경(`bg-white`)을 사용하고 다크 관련 클래스가 없다.
- [ ] `pnpm build` 성공.

**Steps:**

**Step 1:** `src/app/layout.tsx` 의 `metadata` 를 아래로 교체.

```ts
export const metadata: Metadata = {
  title: "FASTCAMPUS SHOP",
  description: "FASTCAMPUS SHOP — 감각적인 패션을 큐레이션하는 쇼핑몰. 상품 목록과 상세 조회.",
};
```

**Step 2:** `<body>` 의 className 을 미니멀 화이트 톤으로 조정. 기존:
```tsx
<body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
```
변경:
```tsx
<body className="flex min-h-full flex-col bg-white text-neutral-900 antialiased">
```

**Step 3:** 빌드 확인(최종 Task 에서 통합 검증).
```bash
pnpm build
```

---

## Task 5: Header 컴포넌트를 W컨셉풍 2단 헤더로 재작성

**Goal:** `Header.tsx` 를 상단 유틸리티 바 + 메인 바(로고/카테고리/아이콘) 구조의 W컨셉풍 헤더로 재작성한다. 모든 링크는 시각용이고 동작은 최소화된다(로고·카테고리 클릭 시 `/products`).

**Dependencies:** None (독립).

**Files:**
- Rewrite: `src/components/Header.tsx` (anchor: default export `Header`)

**Acceptance Criteria:**
- [ ] `Header` 컴포넌트가 단일 default export 로 존재한다.
- [ ] 렌더링 결과에 텍스트 `FASTCAMPUS SHOP` 이 포함된다.
- [ ] `next/link` 의 `Link` 가 import 되고, 로고 클릭 시 `/products` 로 이동하는 `<Link href="/products">` 가 존재한다.
- [ ] `any` 타입 미사용; 컴포넌트에 명시적(또는 추론 가능) 타입.
- [ ] 외부 UI 라이브러리 import 없음 (`next/link`, `react` 만).
- [ ] `pnpm lint` 통과.

**Steps:**

**Step 1:** `src/components/Header.tsx` 전체 교체.

```tsx
import Link from "next/link";

const CATEGORIES = ["WOMEN", "MAN", "BEAUTY", "LIFE", "BEST", "NEW"] as const;

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      {/* 상단 유틸리티 바 */}
      <div className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4 text-[11px] text-neutral-500">
          <span className="tracking-wide">전 상품 무료배송 · 5만원 이상 구매 시 사은품 증정</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">로그인</span>
            <span className="hidden sm:inline">주문조회</span>
            <span className="hidden sm:inline">위시리스트</span>
            <span>고객센터</span>
          </div>
        </div>
      </div>

      {/* 메인 바 */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/products"
          className="text-lg font-semibold tracking-[0.2em] text-neutral-900"
        >
          FASTCAMPUS SHOP
        </Link>

        <div className="flex items-center gap-5 text-neutral-700">
          {/* 검색 아이콘 (시각용) */}
          <span aria-hidden className="cursor-default">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          {/* 위시 아이콘 (시각용) */}
          <span aria-hidden className="hidden cursor-default sm:inline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" strokeLinejoin="round" />
            </svg>
          </span>
          {/* 장바구니 아이콘 (시각용) */}
          <span aria-hidden className="cursor-default">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
              <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* 카테고리 네비게이션 바 */}
      <nav className="border-t border-neutral-100">
        <ul className="mx-auto flex h-11 max-w-6xl items-center gap-6 px-4 text-[13px] tracking-wider text-neutral-700">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link
                href="/products"
                className="font-medium text-neutral-900 transition-colors hover:text-neutral-500"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

> 모든 카테고리 링크는 `/products` 로 연결(실제 카테고리 라우팅 없음). SVG 아이콘은 `aria-hidden` + 시각용 `<span>` (버튼 아님). `CATEGORIES` 는 `as const` 로 readonly 튜플 타입 추론.

**Step 2:** 린트 확인.
```bash
pnpm lint
```
예상: 에러 없음.

---

## Task 6: ProductCard를 W컨셉풍 세로 비율 카드로 재작성

**Goal:** `ProductCard.tsx` 를 테두리 없는 3:4 세로 이미지 + 호버 확대 + name(2줄 트렁케이트) + price 의 W컨셉풍 카드로 재작성한다. 데이터 모델 제약상 브랜드·할인가는 표시하지 않는다.

**Dependencies:** None (독립).

**Files:**
- Rewrite: `src/components/ProductCard.tsx` (anchor: default export `ProductCard`, `ProductCardProps`)

**Acceptance Criteria:**
- [ ] `ProductCard` 가 `ProductCardProps { product: Product }` 인터페이스를 유지한다.
- [ ] 카드 전체가 `<Link href={`/products/${product.id}`}>` 로 감싸져 있다.
- [ ] 이미지 컨테이너의 aspect ratio 클래스가 `aspect-[3/4]`(세로) 이다.
- [ ] `next/image` 의 `Image` 가 import 되고, `alt={product.name}`, `src={product.imageUrl}` 를 사용한다.
- [ ] price 가 `formatPrice(product.price)` 로 표시된다(`formatPrice` import).
- [ ] `any` 미사용. `pnpm lint` 통과.

**Steps:**

**Step 1:** `src/components/ProductCard.tsx` 전체 교체.

```tsx
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
```

> `min-h-[2.6em]` 로 2줄 미만 상품의 name 높이를 맞춰 그리드 정렬 유지. `line-clamp-2` 는 Tailwind v4 내장 유틸리티. 테두리/카드 배경 제거로 W컨셉 "이미지 중심" 카드 연출.

**Step 2:** 린트 확인.
```bash
pnpm lint
```

---

## Task 7: products/page.tsx를 W컨셉풍 목록(타이틀+탭바+정렬바+4열 그리드)로 재작성

**Goal:** `products/page.tsx` 에 페이지 타이틀("WOMEN") + 서브카테고리 탭 바(시각만) + 정렬 옵션 바(시각만) + 4열 반응형 그리드를 구현한다. 필터/정렬 동작은 없다.

**Dependencies:** Task 6 (ProductCard 사용). Task 2 (8개 데이터 사용).

**Files:**
- Rewrite: `src/app/products/page.tsx` (anchor: default export `ProductListPage`)

**Acceptance Criteria:**
- [ ] 페이지에 "WOMEN" 텍스트가 표시된다.
- [ ] 서브카테고리 탭 요소(예: 전체/아우터/상의/하의/원피스/가방/신발)가 렌더링된다(모두 `href="/products"` 또는 비활성).
- [ ] 정렬 옵션 표시(예: "신상품순" 등)가 렌더링된다(시각만).
- [ ] 그리드 클래스가 `grid-cols-2 lg:grid-cols-4` (모바일 2열/데스크톱 4열) 이다.
- [ ] `products.map` 으로 `ProductCard` 가 8개 렌더링된다.
- [ ] `pnpm build` 시 정적 생성 성공.

**Steps:**

**Step 1:** `src/app/products/page.tsx` 전체 교체.

```tsx
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const SUB_CATEGORIES = ["전체", "아우터", "상의", "하의", "원피스", "가방", "신발", "액세서리"] as const;

export default function ProductListPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* 페이지 타이틀 */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-[0.3em] text-neutral-900">WOMEN</h1>
        <p className="mt-2 text-[12px] tracking-wide text-neutral-400">
          감각적인 무드의 이번 시즌 여성 패션 큐레이션
        </p>
      </div>

      {/* 서브카테고리 탭 바 (시각용) */}
      <nav className="mb-6 overflow-x-auto">
        <ul className="flex items-center justify-center gap-6 whitespace-nowrap text-[13px] text-neutral-500">
          {SUB_CATEGORIES.map((cat, i) => (
            <li key={cat}>
              <span
                className={
                  i === 0
                    ? "font-semibold text-neutral-900"
                    : "cursor-default transition-colors hover:text-neutral-900"
                }
              >
                {cat}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      {/* 정렬 옵션 바 (시각용) */}
      <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-3">
        <span className="text-[12px] text-neutral-500">총 {products.length}개의 상품</span>
        <span className="cursor-default text-[12px] text-neutral-500">신상품순 ▾</span>
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

> `i === 0` ("전체") 만 활성 스타일. 나머지 탭은 `cursor-default` 비활성 시각. 정렬 "신상품순 ▾" 은 `<span>` 으로 동작 없음. `overflow-x-auto` + `whitespace-nowrap` 으로 모바일 가로 스크롤.

**Step 2:** 린트 확인.
```bash
pnpm lint
```

---

## Task 8: products/[id]/page.tsx를 W컨셉풍 상세(브레드크럼+대형 이미지+구매 버튼)로 재작성

**Goal:** 상세 페이지를 브레드크럼 + 3:4 대형 이미지 + name/price/description + 시각용 구매 버튼 구조로 재작성한다. `generateStaticParams`, `notFound`, Promise params 규칙을 유지한다.

**Dependencies:** Task 2 (데이터). Task 1 (이미지).

**Files:**
- Rewrite: `src/app/products/[id]/page.tsx` (anchor: `generateStaticParams`, `ProductDetailPageProps`, default export `ProductDetailPage`)

**Acceptance Criteria:**
- [ ] `generateStaticParams` 가 `products.map((p) => ({ id: p.id }))` 를 반환한다(8개).
- [ ] `params: Promise<{ id: string }>` 를 `await` 로 푼다.
- [ ] 존재하지 않는 id → `notFound()` 호출.
- [ ] "HOME > WOMEN > {product.name}" 형태의 브레드크럼이 렌더링된다(링크는 `/products`).
- [ ] "목록으로 돌아가기" 링크가 `/products` 로 존재한다.
- [ ] "장바구니 담기" / "바로 구매하기" 시각용 `<button>` 이 각각 1개 이상 렌더링된다(동작 없어도 됨, onClick 불필요).
- [ ] price 가 `formatPrice` 로 표시.
- [ ] 이미지 `alt={product.name}`, `src={product.imageUrl}`.
- [ ] `pnpm build` 성공(8개 정적 경로 + notFound 404).

**Steps:**

**Step 1:** `src/app/products/[id]/page.tsx` 전체 교체.

```tsx
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
```

> `notFound()` 반환값은 무시(기존 패턴). 버튼은 `type="button"` 만 있고 `onClick` 없음(시각용). 브레드크럼 HOME 은 비링크 텍스트, WOMEN 만 `/products` 링크.

**Step 2:** 빌드 확인.
```bash
pnpm build
```

---

## Task 9: PRD 및 CLAUDE.md 문서를 새 카탈로그/사이트명에 동기화

**Goal:** `CLAUDE.md`, `docs/prd/README.md`, `docs/prd/feature-01-*.md`, `docs/prd/feature-02-*.md` 의 사이트명("패캠 스토어"→"FASTCAMPUS SHOP")과 샘플 데이터 표(잡화 6→패션 8), 그리드 열 수(3→4), 카드/상세 UI 요소 설명을 실제 구현과 일치시킨다. PRD의 **규칙(데이터 모델·로컬 이미지·한글·formatPrice)**은 변경하지 않는다.

**Dependencies:** Task 1~8 완료 후(실제 구현과 일치하는 값 반영).

**Files:**
- Modify: `CLAUDE.md`
- Modify: `docs/prd/README.md`
- Modify: `docs/prd/feature-01-product-list.md`
- Modify: `docs/prd/feature-02-product-detail.md`

**Acceptance Criteria:**
- [ ] 4개 파일 모두에서 "패캠 스토어" 텍스트가 "FASTCAMPUS SHOP" 으로 대체되었다(`grep -r "패캠 스토어"` 결과 0건).
- [ ] `docs/prd/README.md` 의 샘플 데이터 표가 8개 패션 상품 행(id 1~8, 한글 name, 정수 price, `/images/product-0N.svg` imageUrl)으로 갱신되었다.
- [ ] `docs/prd/README.md` 의 `public/images/` 경로 표기가 `product-01.png ~ product-06.png` → `product-01.svg ~ product-08.svg` 로 갱신되었다.
- [ ] `docs/prd/feature-01-product-list.md` 의 그리드 열 수 표기가 데스크톱 3열 → 4열, 모바일 1열 → 2열 로 갱신되었다(`grid-cols-2 lg:grid-cols-4`).
- [ ] `docs/prd/feature-02-product-detail.md` 에 브레드크럼("HOME > WOMEN > 상품명")과 시각용 구매 버튼("장바구니 담기"/"바로 구매하기")이 UI 항목으로 추가되었다(실제 동작 없음 명시).
- [ ] `Product` 인터페이스 정의(README.md §4)가 필드 추가/삭제 없이 원본과 동일(`id/name/price/imageUrl/description`).

**Steps:**

**Step 1 — `docs/prd/README.md`:**

1a. 사이트명: 헤더/레이아웃 섹션의 "패캠 스토어" → "FASTCAMPUS SHOP".

1b. §3 프로젝트 구조의 `product-01.png ~ product-06.png` → `product-01.svg ~ product-08.svg`.

1c. §4 샘플 데이터 표(6행)를 아래 8행으로 교체(명칭/가격은 Task 2 와 정확히 일치):

| id | name | price | imageUrl | description(요지) |
|----|------|-------|----------|-------------------|
| 1 | 오버핏 울 블렌드 아우터 | 289000 | /images/product-01.svg | 넉넉한 오버핏 울 블렌드 아우터. 자연스러운 핏. |
| 2 | 하이넥 케이블 니트 | 89000 | /images/product-02.svg | 클래식 케이블 패턴 하이넥 니트. |
| 3 | 플로럴 롱 원피스 | 159000 | /images/product-03.svg | 은은한 플로럴 롱 원피스. |
| 4 | 와이드 버튼다운 셔츠 | 79000 | /images/product-04.svg | 여유로운 와이드 핏 버튼다운 셔츠. |
| 5 | 벨트 트렌치 코트 | 320000 | /images/product-05.svg | 웨이스트 벨트 트렌치 코트. |
| 6 | 미니멀 크로스백 | 119000 | /images/product-06.svg | 미니멀 라인 크로스백. |
| 7 | 포인트토 로퍼 | 139000 | /images/product-07.svg | 날렵한 포인트토 로퍼. |
| 8 | 실크 스카프 랩 | 49000 | /images/product-08.svg | 가벼운 실크 블렌드 스카프. |

1d. §8 이미지 생성 프롬프트 표(6행 PNG)를 8행 SVG(패션 무드 그라데이션) 요지로 교체하거나, "실사 이미지 대신 패션 무드 단색/그라데이션 placeholder SVG 사용"으로 메모 갱신.

**Step 2 — `docs/prd/feature-01-product-list.md`:**

2a. §4 화면/UI 의 그리드 표기: "모바일 1열 / 태블릿 2열 / 데스크톱 3열" → "모바일 2열 / 데스크톱 4열 (`grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10`)".

2b. §4 에 페이지 타이틀("WOMEN"), 서브카테고리 탭 바(시각만), 정렬 옵션 바(시각만) 항목 추가(모두 동작 없음 명시).

2c. §6 수용 기준의 "6개 상품" → "8개 상품", "데스크톱 3열/모바일 1열" → "데스크톱 4열/모바일 2열".

**Step 3 — `docs/prd/feature-02-product-detail.md`:**

3a. §4 UI 항목에 추가: 브레드크럼("HOME > WOMEN > 상품명", WOMEN 은 `/products` 링크), 시각용 "장바구니 담기"/"바로 구매하기" 버튼(동작 없음). 기존 "목록으로 돌아가기" 링크 유지.

3b. §5 동작 규칙은 그대로 유지(notFound, generateStaticParams 8개).

**Step 4 — `CLAUDE.md`:**

4a. "패캠 스토어" → "FASTCAMPUS SHOP" (§아키텍처 컴포넌트 설명).

4b. 샘플 데이터 6개 → 8개 패션 상품 언급, 이미지 확장자 `.png` → `.svg` 언급 반영(규칙 섹션은 그대로).

**Step 5:** 검증.
```bash
grep -rn "패캠 스토어" docs CLAUDE.md src 2>/dev/null
```
예상 출력: (빈 출력, 0건).

```bash
grep -rn "product-0[1-6]\.png" docs CLAUDE.md 2>/dev/null
```
예상 출력: (빈 출력, 0건 — 모두 `.svg`/`product-0[1-8].svg` 로 대체됨).

---

## Task 10 (Final Verification): 전체 빌드 + 린트 + 수동 체크리스트

**Goal:** 모든 작업 완료 후 전체 빌드와 린트가 통과하고, 핵심 동작 요구사항이 충족됨을 확인한다.

**Dependencies:** Task 1~9 모두 완료.

**Files:** 없음(검증만).

**Acceptance Criteria:**
- [ ] `pnpm lint` 가 에러/경고 없이 종료 코드 0.
- [ ] `pnpm build` 가 종료 코드 0 으로 성공하고, 빌드 로그에 `/products/1` ~ `/products/8` 8개 정적 경로가 생성됨(또는 404 page 포함).
- [ ] `grep -rn "FASTCAMPUS SHOP" src` 출력이 `Header.tsx`, `layout.tsx` 적어도 2곳 이상에서 매칭.
- [ ] `grep -rn "패캠 스토어" src docs CLAUDE.md` 출력 0건.
- [ ] `ls public/images/*.svg | wc -l` === 8, `ls public/images/*.png 2>/dev/null | wc -l` === 0.

**Steps:**

**Step 1:** 린트.
```bash
pnpm lint
```
예상: 성공.

**Step 2:** 빌드.
```bash
pnpm build
```
예상: 성공. 빌드 로그에 `○ /products/1` ~ `● /products/8` 형태의 8개 정적 경로와 `/products` (목록), 404(not-found) 포함.

**Step 3:** 텍스트 검증.
```bash
grep -rn "FASTCAMPUS SHOP" src
grep -rn "패캠 스토어" src docs CLAUDE.md || echo "OK: no occurrences"
```

**Step 4:** 이미지 카운트.
```bash
ls public/images/*.svg | wc -l   # 8 기대
ls public/images/*.png 2>/dev/null | wc -l   # 0 기대
```

**Step 5 (수동, 선택):** `pnpm start` 후 브라우저에서 `/products`(8 카드, 4열), 카드→`/products/N`(브레드크럼/이미지/버튼), `/products/999`(404), "목록으로 돌아가기" 동작 확인. (자동화 불가하므로 선택 항목.)

---

## Critic Responses

(평가 후 작성)

---

## Plan Amendment Log

### Amendment 1 (during Task 10 / E2E gate) — `next.config.ts` SVG 허용

**Trigger:** E2E gate (`pnpm start` + 런타임 프로브)에서 `next/image` 가 SVG 소스에 대해 HTTP 400 응답. 원인: Next.js 는 보안상 `dangerouslyAllowSVG: true` 가 없으면 `next/image` 최적화 파이프라인이 SVG 를 거부한다. 빌드는 성공하지만 런타임 이미지가 깨진다.

**Plan defect:** 원본 Work Scope 의 "Out" 항목이 `next.config.ts` 변경을 명시적으로 배제하진 않았지만, Task 목록에 `next.config.ts` 수정 작업이 없었다. Task 1 critic 의 사전 경고(advisory)가 E2E gate 에서 실제 결함으로 확인됨.

**Fix (범위 내, Goal 일치):** `next.config.ts` 의 `images` 옵션에 다음을 추가:
- `dangerouslyAllowSVG: true` — SVG 최적화 허용(로컬 placeholder SVG 한정).
- `contentDispositionType: "attachment"` — SVG 가 인라인 렌더링되지 않고 다운로드/이미지로 처리.
- `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` — SVG 내 임의 스크립트 실행 차단(XSS 방어). 표준 Next.js 권장 하드닝.

이 변경은 Goal("W컨셉풍 쇼핑몰 페이지가 동작한다")을 만족하기 위한 최소 필수 통합 픽스이며, 데이터 모델·로컬 이미지 규칙·한글 규칙·formatPrice 규칙 등 PRD hard rule 은 건드리지 않는다. 새 npm 의존성 추가 없음. 다크모드·필터/정렬 로직 도입 없음.

**Re-verification:** Amendment 적용 후 `pnpm build` 재실행 + `pnpm start` 런타임 프로브(`/_next/image?url=/images/product-01.svg` → HTTP 200)로 확인.
