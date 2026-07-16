# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

강의 실습용 간단 쇼핑몰. 상품 목록과 상품 상세 조회만 제공하는 **프론트엔드 전용** Next.js 앱이다. 백엔드·DB·API 라우트·인증·장바구니·결제는 **의도적으로 범위에서 제외**되어 있으므로 새로 추가하지 말 것. 모든 상품 데이터는 하드코딩된 정적 배열에서 직접 import 한다.

**현재 상태**: 실습 시작 지점. 프로젝트 스캐폴드(Next.js + TypeScript + Tailwind 설정, 루트 레이아웃, 상품 이미지)와 PRD만 있고 **기능 코드는 아직 구현되어 있지 않다**. 아래 "구현할 구조"는 앞으로 만들어야 할 목표 구조다.

전체 사양은 `docs/prd/`에 정의되어 있다 (`README.md` = 공통 사양, `feature-01-*` = 상품 목록, `feature-02-*` = 상품 상세). 기능을 구현·변경할 때는 해당 PRD의 수용 기준을 기준으로 삼는다. 상품 6종의 이름·가격·설명 요지는 `docs/prd/README.md`의 "샘플 데이터" 표에 확정되어 있으므로 임의로 바꾸지 말 것.

## 명령어

패키지 매니저는 **pnpm**을 사용한다 (`pnpm-lock.yaml`, `pnpm-workspace.yaml` 존재).

```bash
pnpm install       # 의존성 설치
pnpm dev           # 개발 서버 (http://localhost:3000)
pnpm build         # 프로덕션 빌드
pnpm start         # 빌드 결과 실행
pnpm lint          # ESLint 검사
```

테스트 프레임워크는 설정되어 있지 않다.

## 아키텍처

Next.js **App Router** + TypeScript(strict) + **Tailwind CSS v4**.

### 지금 있는 것 (스캐폴드)

- `src/app/layout.tsx` — 루트 레이아웃. `<html lang="ko">`로 감싸고 `children`을 `<main>`에 렌더한다. 공통 `Header`는 구현하면서 여기에 붙인다.
- `src/app/globals.css` — Tailwind 지시어.
- `public/images/product-01.png` ~ `product-06.png` — 상품 6종 이미지 (PRD 샘플 데이터의 `imageUrl`과 1:1 대응).
- `next.config.ts` — `images.unoptimized: true`. 실습 중 같은 파일명으로 이미지를 교체해도 `next/image` 캐시 때문에 옛 이미지가 남는 문제를 피하려는 설정이다.
- **경로 별칭**: `@/*` → `src/*` (tsconfig).

### 구현할 구조 (PRD 기준)

- **데이터 흐름**: `src/data/products.ts`가 `Product` 타입과 6개 상품 배열을 export 하는 단일 진실 공급원(SSOT)이 된다. 페이지·컴포넌트는 이 배열을 직접 import 해서 렌더링한다. 서버에서 데이터를 가져오지 않으므로 fetch/API 로직이 없다.
- **라우팅**:
  - `src/app/page.tsx` — 홈(`/`)은 `redirect("/products")`만 수행.
  - `src/app/products/page.tsx` — 상품 목록(그리드).
  - `src/app/products/[id]/page.tsx` — 상품 상세. `params`는 **Promise 타입**이라 `await params`로 풀어야 한다(Next.js 16). `products.find`로 조회하고 없으면 `notFound()`(404). `generateStaticParams`로 6개 경로를 정적 생성한다.
- **컴포넌트**: `src/components/`에 `ProductCard`(목록 카드, 카드 전체가 상세 링크), `Header`(사이트명 "패캠 스토어" → `/products`).
- **유틸**: `src/lib/format.ts`의 `formatPrice()`.

> `src/app/page.tsx`가 아직 없으므로 `pnpm dev` 후 `/`는 404다. 상품 목록을 만들면서 함께 채운다.

## 이 코드베이스의 규칙 (PRD 기반)

- 사용자 노출 텍스트는 **모두 한글**.
- 가격 표시는 반드시 `src/lib/format.ts`의 `formatPrice()`를 사용한다 (`12,000원` 형식). 직접 포맷하지 말 것.
- 이미지는 **`next/image`**만 사용하고 `imageUrl`은 `/images/`로 시작하는 로컬 경로만. 모든 이미지에 `alt`(상품명) 필수.
- `any` 금지. 컴포넌트·데이터에 명시적 타입.
- 상품을 추가할 때는 `src/data/products.ts` 배열에 항목을 넣고 대응하는 이미지를 `public/images/`에 둔다. `id`는 고유 문자열, `price`는 정수(원).
