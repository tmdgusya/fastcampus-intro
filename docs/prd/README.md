# PRD: 간단 쇼핑몰

강의 실습용 간단 쇼핑몰의 제품 요구사항 정의서(PRD)입니다.
**기능별로 파일이 분리**되어 있으며, 각 기능 문서는 이 공통 문서(`README.md`)의 규칙을 전제로 합니다.

## 문서 구성

| 파일 | 내용 |
|------|------|
| `README.md` (이 문서) | 공통 사양 — 개요, 기술 스택, 프로젝트 구조, 데이터 모델, 공통 UI, 유틸 |
| `feature-01-product-list.md` | 기능 1 — 상품 목록 (`/products`) |
| `feature-02-product-detail.md` | 기능 2 — 상품 상세 / 조회 (`/products/[id]`) |

> 각 기능 문서는 독립적으로 읽고 구현할 수 있도록, 필요한 데이터 모델·경로를 이 공통 문서에서 참조한다.

---

## 1. 개요

Next.js 기반의 간단한 쇼핑몰. 사용자는 **상품 목록을 보고**, **개별 상품의 상세 정보를 조회**할 수 있다. 강의 실습용으로 구조의 단순함과 명확함을 최우선으로 한다.

### 범위
- **포함**: 상품 목록 화면, 상품 상세 화면, 정적(하드코딩) 상품 데이터
- **제외**: 백엔드/DB/API 서버, 검색·필터·정렬, 장바구니·결제·주문, 로그인/인증, 관리자 기능, 상품 등록/수정/삭제

---

## 2. 기술 스택 (고정)

| 항목 | 선택 |
|---|---|
| 프레임워크 | Next.js (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 데이터 | 프론트엔드 전용 · 하드코딩 배열 (`src/data/products.ts`) |
| 이미지 | 로컬 파일 (`public/images/*`) |

> 백엔드·DB·API 라우트는 사용하지 않는다. 모든 데이터는 정적 배열에서 직접 import 한다.

---

## 3. 프로젝트 구조

```
fastcampus-intro/
├── public/
│   └── images/
│       ├── product-01.svg ~ product-08.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃 (공통 헤더 포함)
│   │   ├── page.tsx                # 홈 → /products 노출/리다이렉트
│   │   ├── globals.css             # Tailwind 지시어
│   │   └── products/
│   │       ├── page.tsx            # 기능 1: 상품 목록
│   │       └── [id]/
│   │           └── page.tsx        # 기능 2: 상품 상세
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   └── Header.tsx
│   ├── data/
│   │   └── products.ts             # 상품 데이터 + 타입
│   └── lib/
│       └── format.ts               # 가격 포맷 유틸
├── docs/prd/                       # 본 PRD 문서들
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. 데이터 모델

`src/data/products.ts` 에 정의한다.

```ts
export interface Product {
  id: string;          // 고유 식별자. 라우팅(/products/[id])에 사용
  name: string;        // 상품명
  price: number;       // 가격 (단위: 원, 정수)
  imageUrl: string;    // 로컬 이미지 경로. 예: "/images/product-01.svg"
  description: string; // 상세 설명 (2~4문장)
}

export const products: Product[] = [ /* 아래 표의 8개 상품 */ ];
```

### 규칙
- `id`는 문자열이며 고유. (예: `"1"` … `"8"`)
- `price`는 정수(원). 화면에서는 `formatPrice`로 `12,000원` 형식 표시.
- `imageUrl`은 반드시 `/images/`로 시작하는 로컬 경로.
- `products` 라는 이름의 `Product[]` 배열로 export.

### 샘플 데이터 (8개, 확정)

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

> `description`은 위 요지를 바탕으로 2~4문장의 자연스러운 한글 설명으로 완성한다.

---

## 5. 공통 UI

### 헤더 (`components/Header.tsx`)
- 모든 페이지 상단에 노출 (`layout.tsx`에 포함).
- 좌측에 사이트명 텍스트 **"ROACH SHOP"**, 클릭 시 `/products`로 이동.

### 레이아웃
- 중앙 정렬 컨테이너 (예: `max-w-6xl mx-auto px-4`).
- 모바일 우선 반응형, Tailwind 기본 브레이크포인트.

---

## 6. 유틸리티

`src/lib/format.ts`:

```ts
export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}
```

- 모든 가격 표시는 이 함수를 사용한다.

---

## 7. 비기능 요구사항 / 제약

- **언어**: 모든 사용자 노출 텍스트는 한글.
- **타입 안전성**: 모든 컴포넌트·데이터에 TypeScript 타입 명시. `any` 금지.
- **이미지**: `next/image` 사용, 로컬 경로만 사용. 모든 이미지에 `alt`(상품명) 지정.
- **에러 처리**: 없는 상품은 `notFound()`(404)로 처리.

---

## 8. 이미지 생성

패션 무드의 **단색/그라데이션 placeholder SVG**(8종)를 사용한다. (사용자가 직접 생성)
- 파일 경로: `public/images/product-01.svg` ~ `product-08.svg` (§4 샘플 데이터와 1:1 대응).
- 공통 스타일: 1:1 정사각형, 제품 무드에 맞춘 단색 또는 부드러운 그라데이션 배경, 미니멀 이커머스 톤.
- 실제 제품 사진이 아닌 **placeholder**(레이아웃·비율 확인용)이며, 필요 시 실사 이미지로 교체한다.

---

## 9. 완료(Done) 정의

- [ ] Next.js(App Router) + TypeScript + Tailwind 프로젝트가 실행된다.
- [ ] `src/data/products.ts`에 `Product` 타입과 8개 상품 배열이 존재한다.
- [ ] 기능 1(상품 목록) 수용 기준을 모두 만족한다. → `feature-01-product-list.md`
- [ ] 기능 2(상품 상세) 수용 기준을 모두 만족한다. → `feature-02-product-detail.md`
- [ ] 가격은 전 화면에서 `formatPrice`로 콤마 포맷 표시된다.
- [ ] 사용자 노출 텍스트가 모두 한글이다.
