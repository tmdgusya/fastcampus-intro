# 데이터 모델 / 엔티티 설계 — 상품(Product)

> **이 문서를 읽는 사람**: 개발을 막 시작한 사람. "엔티티가 뭔지", "데이터 모델을 왜 이렇게 만드는지", "그게 백엔드랑 어떻게 이어지는지"가 궁금한 사람.

> ⚙️ **이 문서는 두 가지 역할을 합니다.**
> 1. **수강생용 개념 설명서** — "왜 이렇게 설계했나?"를 처음부터 읽을 수 있도록.
> 2. **구현 명세(spec)** — 에이전트(또는 사람)가 이 문서를 읽고 **`Product` 엔티티를 코드로 바로 구현**할 수 있도록. 뒤쪽 "[구현 명세]" 절과 맨 끝 "에이전트 구현 지시문"이 그 역할을 합니다.
>
> 단, 이 문서는 **설계만** 다룹니다. Prisma 등 패키지 설치·실행은 에이전트의 구현 단계, 혹은 수강생과 함께하는 실습 시간에 직접 진행합니다.

---

## 0. 한 문장 요약

> **엔티티(Entity)**는 우리 앱에서 다루는 "물건(데이터) 하나"를 **어떤 항목들로 표현할지 약속한 그릇**이다. 쇼핑몰에서 가장 중요한 물건은 **상품**이고, 이 상품 하나를 코드로 어떻게 표현할지 정하는 일이 이번 설계의 핵심이다.

---

## 1. "엔티티"와 "모델"이라는 단어

처음엔 비슷한 말이 섞여 나와 헷갈린다. 이 문서에서는 이렇게만 이해하면 충분하다.

- **엔티티(Entity)**: 비즈니스에서 "스스로 존재하는 데이터 대상". 쇼핑몰의 명사들 — **상품, 회원, 주문, 장바구니** 같은 것.
- **모델(Model)**: 그 엔티티를 **코드/구조로 표현한 것**. 우리 코드의 `Product` 타입이 곧 상품 엔티티의 모델이다.

실습에서는 둘을 거의 같은 뜻으로 써도 무방하다.

> 💡 비유: 엔티티는 **서류 양식**이다. "상품 등록서" 양식에는 `[상품번호][상품명][가격][사진][설명]` 칸이 있다. 이 **칸의 목록과 규칙**을 정하는 일이 바로 *데이터 모델링*이다.

---

## 2. 우리 상품(Product) 모델 (PRD 확정)

PRD(`docs/prd/README.md`)가 정확히 이 모양을 확정해 두었다. **이것이 우리의 단일 진실 공급원(SSOT)**이다.

```ts
export interface Product {
  id: string;          // 고유 식별자. 라우팅(/products/[id])에 사용
  name: string;        // 상품명
  price: number;       // 가격 (단위: 원, 정수)
  imageUrl: string;    // 로컬 이미지 경로. 예: "/images/product-01.png"
  description: string; // 상세 설명 (2~4문장)
}
```

데이터 6개(확정) — `id / name / price / imageUrl`:

| id | name | price | imageUrl |
|----|------|-------|----------|
| 1 | 미니멀 화이트 머그컵 | 12000 | /images/product-01.png |
| 2 | 원목 도마 세트 | 29000 | /images/product-02.png |
| 3 | 코튼 캔버스 에코백 | 18000 | /images/product-03.png |
| 4 | 아로마 소이 캔들 | 22000 | /images/product-04.png |
| 5 | 스테인리스 텀블러 500ml | 25000 | /images/product-05.png |
| 6 | 리넨 룸슬리퍼 | 15000 | /images/product-06.png |

> `description`의 요지는 PRD에 적혀 있고, 2~4문장의 자연스러운 한글로 완성한다. 본 문서는 데이터의 "모양"에 집중한다.

---

## 3. 왜 이렇게 설계했을까? (필드·타입별 설계 이유)

이 절이 학습의 핵심이다. "왜 하필 이 항목에, 하필 이 타입인가?"를 하나씩 본다.

### 3.1 왜 `id`가 필요할까? — "이게 어느 상품이지?"

두 상품이 이름이 같아도 `id`로 구분한다. 더 중요한 건, **`id`가 URL의 일부**가 된다는 점이다.

- `/products/1`, `/products/2` → 상세 페이지 주소 자체가 `id`로 만들어진다.
- `id`가 없으면 특정 상품의 상세 페이지를 만들 방법이 없다.

> 💡 비유: **학번 / 주민등록번호**. 동명이인을 구분하는 고유 번호다.

### 3.2 왜 `id`가 숫자가 아니라 문자열(string)?

지금은 `"1"`~`"6"`이라 숫자처럼 보이지만, 타입은 `string`이다. 이유:

- URL은 애초에 **텍스트**다. `/products/abc-99`처럼 글자가 섞인 id도 얼마든지 가능하다.
- 현업에서는 UUID(`"550e8400-e29b-41d4-a716-446655440000"`)처럼 글자+숫자가 섞인 id를 자주 쓴다. → 처음부터 `string`이 유연하다.
- 나중에 id 형태가 바뀌어도 **타입을 안 바꿔도 된다**.

### 3.3 왜 `price`는 숫자(number)일까? ⭐ (가장 중요)

가격을 텍스트로 `"12,000원"` 저장한다고 상상해 보자.

- **계산이 안 된다**: `"12,000원" + "3,000원"` = ? (문자열이라 엉뚱한 결과가 나온다)
- **정렬·비교도 엉킨다**: 텍스트 정렬은 "10000"이 "9000"보다 앞에 온다(글자순).
- **쉼표는 '보여주기용'**이다. 저장할 때 붙이는 게 아니라 화면에 뿌릴 때 붙이는 것이다.

그래서: **저장은 순수 숫자(`12000`)**, **보여줄 때만** `formatPrice()`로 `"12,000원"`으로 바꾼다.

```ts
export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}
```

> 💡 비유: 냉장고엔 재료를 **날것으로** 보관하고, 식탁에 낼 때만 접시에 담아 장식한다.
> **저장 ≠ 표시.** 이 원칙이 곧 `src/lib/format.ts`의 존재 이유다.

### 3.4 왜 `imageUrl`은 "이미지 자체"가 아니라 "경로"?

이미지 파일은 `public/images/` 폴더에 두고, 데이터에는 그 파일의 **주소**(`/images/product-01.png`)만 적는다.

> 💡 비유: **도서관 카드**. 책 전체를 복사해 카드에 붙이지 않고, "이 책은 3층 B선반에 있어"라고 **위치**만 적는다.

왜 이렇게? 이미지(바이너리)를 데이터 배열에 넣으면 용량이 엄청 커지고, 사진 하나 바꿀 때마다 데이터까지 고쳐야 한다. "주소"만 두면 파일만 바꾸면 끝이다.

### 3.5 왜 `description`이 필요할까? — 모델 하나로 화면 두 개

목록 카드에는 안 보이지만, 상세 페이지(`/products/1`)에서는 보인다. 핵심은 **같은 `Product` 모델 하나**로 "목록(요약)"과 "상세(전체)" 두 화면을 커버한다는 점이다. 모델을 잘 정의해 두면 화면이 여러 개여도 데이터 구조는 하나로 버틴다.

---

## 4. 이 모델은 백엔드에서 어떻게 흘러가나? (개념)

> 우리 실습은 프론트엔드 전용이고, 데이터는 `src/data/products.ts`의 **하드코딩 배열**이다. 하지만 "진짜" 쇼핑몰이라면 **똑같은 `Product` 모양이 백엔드로 넘어간다**. 이해를 위해 그 흐름을 본다.

### 4.1 데이터베이스(DB)의 "테이블"이 된다

> 💡 비유: **엑셀 시트**.

- 모델 `Product` → DB **테이블** `products`
- 필드 → **열(column)**: `id`, `name`, `price`, `image_url`, `description`
- 배열의 상품 1개 → **행(row / 레코드)**

```
products 테이블
┌────┬──────────────────────┬───────┬───────────────────────┬──────────────┐
│ id │ name                 │ price │ image_url             │ description  │
├────┼──────────────────────┼───────┼───────────────────────┼──────────────┤
│ 1  │ 미니멀 화이트 머그컵  │ 12000 │ /images/product-01.png│ ...          │
│ 2  │ 원목 도마 세트        │ 29000 │ /images/product-02.png│ ...          │
│ ...│                      │       │                       │              │
└────┴──────────────────────┴───────┴───────────────────────┴──────────────┘
```

> 참고: 코드에선 `imageUrl`(camelCase)이라 쓰지만, DB에선 보통 `image_url`(snake_case)로 저장한다. 이 연결은 구현 명세(§7)에서 다룬다.

### 4.2 API가 "이 모양 그대로" 데이터를 보내준다

> 💡 비유: **식당**. 손님(프론트엔드)이 주문하면 → 주방(백엔드)이 창고(DB)에서 재료를 꺼내 요리(데이터)를 서빙한다.

- 프론트엔드: "상품 목록 줘" 라고 **요청**
- 백엔드: DB에서 꺼내서 **JSON**으로 **응답**

그 JSON의 모양이 **바로 우리가 정한 `Product`**다.

```json
{
  "id": "1",
  "name": "미니멀 화이트 머그컵",
  "price": 12000,
  "imageUrl": "/images/product-01.png",
  "description": "군더더기 없는 300ml 세라믹 머그컵. 전자레인지·식기세척기 사용 가능."
}
```

> 📍 우리의 하드코딩 배열은 = **"백엔드가 보내줄 데이터를 손으로 미리 채워둔 것"** = **백엔드 흉내내기**다. 진짜 백엔드를 붙이면, 배열 자리가 API 호출로 바뀔 뿐 데이터 모양은 그대로다.

### 4.3 같은 모양이 DB → API → 화면 을 오간다

```
DB products 테이블 ──(백엔드 조회)──▶ API JSON ──(프론트 수신)──▶ Product 객체 ──▶ 화면
        └─────────────  모두 같은 "Product 모양"  ─────────────┘
```

이 **"하나의 모양"**을 미리 고정해 두면, 데이터가 여러 단계를 오가도 모양이 꼬이지 않는다. **이것이 모델을 설계하는 진짜 이유다.**

---

## 5. [구현 명세] 데이터베이스: SQLite + ORM 선택

### 5.1 DB는 SQLite로

- **왜**: 설치·설정이 필요 없다(별도 서버 프로세스 없음). **데이터 = 파일 1개**(`.db`). 로컬 개발·학습용으로 가장 가볍고 딱 알맞다.

> 💡 비유: SQLite는 **"데이터베이스를 한 파일로 담은 메모장"**이다. MySQL/PostgreSQL이 '은행(서버)'이라면, SQLite는 서버 없이 동작하는 **개인 금고** 같다.

### 5.2 ORM은 Prisma로 (프로젝트 테크스택에 맞춰)

**ORM**(Object-Relational Mapping)은 데이터베이스를 **코드(객체)**로 다루게 해 주는 도구다. SQL을 직접 안 써도 된다.

| 이름 | 뭔가요 | 왜 Prisma를 골랐나요 |
|------|--------|----------------------|
| **Prisma** ✅ | 스키마-퍼스트 ORM. `.prisma` 파일로 모델 선언 → 타입·클라이언트 자동 생성 | **TypeScript-Native**라 우리 스택(Next.js + TS)과 일치, 학습 자료가 많음, 타입 자동 생성으로 초보자·에이전트 모두에게 안전 |
| Drizzle | 가볍고 SQL-넌 코드 우선 ORM | 훌륭하지만 학습 자료가 상대적 적고, 스키마-선언 방식이 엔티티 개념 설명엔 Prisma가 더 직관적 |
| TypeORM | 데코레이터 기반, 오래됨 | 설정이 무겁고 TS-최신 스택과 덜 어울림 |
| Sequelize | 가장 오래된 Node ORM | 유지보수 모멘텀이 약하고 TS 지원이 뒤처짐 |

> 핵심 메시지: **엔티티를 선언하면 코드를 만들어준다**는 점에서, "모델 = 코드" 연결이 가장 잘 보이는 Prisma를 쓴다.

### 5.3 ⚠️ 버전 주의: Prisma 7 (현재 최신, 7.x)

Prisma 7은 **설정 방식이 바뀌었다.** 인터넷의 옛 튜토리얼(Prisma 5/6) 코드를 그대로 쓰면 동작하지 않는다. 꼭 기억할 변화:

- `schema.prisma`의 `datasource`에 더 이상 `url`을 쓰지 **않는다** → 연결 주소는 `prisma.config.ts`로.
- 런타임에는 **driver adapter**(`@prisma/adapter-better-sqlite3`)를 `PrismaClient`에 전달한다.
- `dotenv` 패키지가 필요하다.

---

## 6. [구현 명세] 설치 가이드 — 에이전트/수강생이 실행할 명령

> 본 문서는 **설계 명세**다. 아래 명령은 에이전트의 구현 단계, 또는 수강생과 함께하는 실습 시간에 **직접 실행**한다. 이 문서를 작성하는 시점에는 설치하지 않는다.

### 6.1 SQLite — 시스템 설치가 사실 필요 없다 (원할 때만 CLI)

- Prisma + `@prisma/adapter-better-sqlite3` 조합은 SQLite를 **파일로 직접 읽고 쓴다**. → **DB 서버 설치 불필요**. `dev.db` 파일 하나로 동작.
- 다만 터미널에서 DB 파일을 직접 들여다보고 싶으면 `sqlite3` **CLI**가 있으면 편하다(선택). 안 깔려 있을 때:

  | 환경 | 명령 |
  |------|------|
  | macOS | `brew install sqlite` (보통 이미 설치됨) |
  | Linux(Debian/Ubuntu) | `sudo apt-get install -y sqlite3` |
  | Linux(Fedora) | `sudo dnf install -y sqlite` |
  | Windows | `winget install SQLite.SQLite` (또는 공식 zip) |

  설치 확인: `sqlite3 -version`

> 참고: 본 개발 머신(Linux)에는 현재 `sqlite3` CLI가 설치되어 있지 않다. **하지만 Prisma 구동에는 영향이 없다**(CLI는 디버깅용일 뿐).

### 6.2 패키지 설치 (Prisma 7 + SQLite adapter)

```bash
# 개발 의존성 (Prisma CLI + 타입)
pnpm add -D prisma @types/node @types/better-sqlite3

# 런타임 의존성 (클라이언트 + 어댑터 + env)
pnpm add @prisma/client @prisma/adapter-better-sqlite3 dotenv

# 시드 스크립트 실행용 (아직 없으면)
pnpm add -D tsx
```

### 6.3 ⚠️ pnpm 함정 — 이 프로젝트에서 꼭 처리 (빌드 승인)

이 프로젝트는 **pnpm 11**을 쓴다. pnpm은 보안상 **네이티브 빌드 스크립트를 기본 차단**한다. `prisma` 엔진과 `better-sqlite3`(네이티브 컴파일 필요)은 설치 시 빌드 스크립트를 돌려야 정상 동작한다.

현재 `pnpm-workspace.yaml`에는 이미 빌드 승인 목록이 있다:

```yaml
onlyBuiltDependencies:
  - sharp
  - unrs-resolver
```

**Prisma 관련 항목을 같은 목록에 추가**한다:

```yaml
onlyBuiltDependencies:
  - sharp
  - unrs-resolver
  - "@prisma/engines"
  - prisma
  - better-sqlite3
```

> 이걸 빼먹으면 `Command prisma not found` 또는 `better-sqlite3` 로드 실패가 난다(실제 확인된 함정). 수정 후 `pnpm install`을 다시 실행한다.

### 6.4 초기화

```bash
pnpm dlx prisma init --datasource-provider sqlite
```

- 생성되는 파일: `prisma/schema.prisma`, `.env`(`DATABASE_URL="file:./dev.db"`), `prisma.config.ts`

> ⚠️ **Next.js 통합 주의**: Prisma 공식 퀵스타트는 빈 TS 프로젝트를 가정해 `package.json`에 `"type": "module"`과 ESM tsconfig를 요구한다. **이 프로젝트는 이미 Next.js가 돌아가는 상태**이므로 그 설정을 **덮어쓰면 Next.js 빌드가 깨질 수 있다.** Prisma가 만든 파일(`prisma/`, `prisma.config.ts`, `.env`)만 반영하고, 기존 Next.js 설정은 건드리지 않는다. 정확한 통합(모듈 타입, 생성된 클라이언트 경로, tsconfig)은 실습 시간에 맞춘다.

---

## 7. [구현 명세] Prisma 스키마 + 설정 (에이전트가 만들 파일)

### 7.1 `prisma/schema.prisma` (Prisma 7 — `url` 없음)

```prisma
generator client {
  provider = "prisma-client"     // Prisma 7의 ESM 기본 제너레이터 (5/6의 prisma-client-js 와 다름)
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"            // url 은 prisma.config.ts 로!
}

model Product {
  id          String   @id
  name        String
  price       Int
  imageUrl    String   @map("image_url")   // 코드는 camelCase, DB 컬럼은 snake_case
  description String

  @@map("products")              // 모델 Product → 테이블 products
}
```

읽는 법:

- `provider = "prisma-client"`: Prisma 7의 새 제너레이터. (Prisma 5/6의 `prisma-client-js`와 다름.)
- `@map("image_url")` / `@@map("products")`: 코드에선 `imageUrl`을 쓰되 DB에는 `image_url`로, 모델 `Product`는 테이블 `products`로 저장하겠다는 약속(§4.1의 camelCase↔snake_case 연결).
- `Int` = `price`(정수). `String @id` = `id`. → PRD 타입 규칙과 정확히 일치.

### 7.2 `prisma.config.ts`

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") }, // Prisma 7: 연결 주소는 여기로
});
```

### 7.3 `.env`

```bash
DATABASE_URL="file:./dev.db"
```

### 7.4 런타임 클라이언트 (`src/lib/prisma.ts`)

```ts
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });
```

> 가져오기 경로(`../../generated/prisma/client`)는 §7.1의 `output` 위치에 따라 달라진다. Next.js와의 통합(경로/별칭)은 실습 시간에 맞춘다.

### 7.5 마이그레이션 + 제너레이트 (DB 테이블 생성 + 타입 생성)

```bash
pnpm dlx prisma migrate dev --name init   # products 테이블 생성 + dev.db 파일 생성
pnpm dlx prisma generate                   # generated/prisma/ 에 타입·클라이언트 생성
```

### 7.6 시드 — PRD의 6개 상품을 DB에 넣기 (`prisma/seed.ts`)

```ts
import { prisma } from "../src/lib/prisma";

// PRD(docs/prd/README.md) 샘플 데이터를 그대로 사용.
const products = [
  {
    id: "1",
    name: "미니멀 화이트 머그컵",
    price: 12000,
    imageUrl: "/images/product-01.png",
    description: "군더더기 없는 300ml 세라믹 머그컵. 전자레인지·식기세척기 사용 가능.",
  },
  // …id 2~6: PRD 표의 name/price/imageUrl 과 description 요지를 2~4문장으로 완성해 같은 구조로 추가
];

async function main() {
  await prisma.product.createMany({ data: products });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

실행: `pnpm dlx tsx prisma/seed.ts` (또는 `prisma.config.ts`의 `migrations.seed`에 `"tsx prisma/seed.ts"`를 등록해 `pnpm dlx prisma db seed`로 실행).

---

## 8. 실제 쇼핑몰이라면? 엔티티들이 어떻게 연결되나 (전경)

우리 실습 범위는 **`Product` 1개**다. 하지만 진짜 쇼핑몰은 여러 엔티티가 **서로 id로 연결**된다.

```
User ──< Order ──< OrderItem >── Product
                          │
Cart ────────────────────┘ (productId 참조)
```

- **User**(회원), **Product**(상품), **Order**(주문), **OrderItem**(주문 항목), **Cart**(장바구니)
- 연결의 핵심: **id로 서로를 가리킨다(관계)**. 예를 들어 주문 항목은 *"어떤 회원(userId)이, 어떤 상품(productId)을, 몇 개(quantity) 샀는지"*를 id로 기록한다.

Prisma 로 관계를 표현하면 이런 식이다(참고용 — 지금은 구현하지 않는다):

```prisma
model OrderItem {
  id        String  @id
  orderId   String
  productId String
  quantity  Int
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id]) // ← 상품을 id로 참조
}
```

이렇게 엔티티 간 **연결 구조를 짜는 일**이 *데이터 모델링 / 엔티티 설계*의 본질이다. 우리 실습은 그 **가장 작은 조각(`Product`)**을 직접 만들어 보는 것이다.

---

## 9. 에이전트 구현 지시문 (이 문서를 읽고 바로 구현하는 에이전트에게)

> **TASK**: 이 설계 명세에 따라 `Product` 엔티티를 **SQLite + Prisma 7**로 구현하라. (이것은 실행 과제다. 본 §6~§7의 파일/명령을 만들고 실행한다.)

- **DELIVERABLE**: (1) `prisma/schema.prisma` 의 `Product` 모델 (2) `prisma.config.ts` (3) `.env` 의 `DATABASE_URL` (4) `src/lib/prisma.ts` 클라이언트 (5) `migrate` + `generate` 실행 결과(`products` 테이블 + 타입 생성) (6) `prisma/seed.ts` 로 6개 상품 삽입.
- **SCOPE**: `Product` 엔티티 **1개만**. §8의 User/Order 등은 참고용이지 지금 만들지 않는다.
- **규칙(프로젝트 룰 준수)**: 한글 UI 텍스트 유지, `price`는 정수(원), `imageUrl`은 `/images/` 로컬 경로, `any` 금지. PRD의 6개 상품(id/name/price/imageUrl/description)을 그대로 시드.
- **VERIFY**: `prisma.product.findMany()` 가 6개를 반환하고, 각 행의 필드가 PRD와 일치한다.
- **STOP WHEN**: `migrate`·`generate` 성공 + 시드 후 `findMany()` 로 6개 조회 확인 + 기존 프론트엔드(상품 목록/상세)가 깨지지 않음.

---

## 10. 학생이 꼭 가져갈 인사이트

1. **모델은 "데이터의 약속된 그릇"이다.** 항목과 타입을 미리 정하면 실수가 줄고, 함께 일하기 쉽다.
2. **가격은 숫자로 저장하고, 보여줄 때만 포맷한다.** (저장 ≠ 표시)
3. **`id`는 모든 것을 연결하는 끈이다.** URL·DB 관계·API가 모두 `id`로 묶인다.
4. **같은 모델이 DB → API → 화면을 오간다.** 모양이 같아야 흐름이 매끄럽다.
5. **우리의 하드코딩 배열은 "백엔드가 보내줄 데이터의 샘플"이다.** 진짜 백엔드를 붙이면 배열 자리가 API 호출로 바뀔 뿐이다.
6. **엔티티는 `id`로 서로 연결된다.** 상품→주문→회원이 이어지는 구조가 데이터 모델링의 본질이다.

---

## 11. 참고 자료

- 본 프로젝트 PRD: [`docs/prd/README.md`](../prd/README.md) — 데이터 모델·샘플 데이터
- Prisma SQLite 퀵스타트(Prisma 7): https://www.prisma.io/docs/prisma-orm/quickstart/sqlite
- Prisma Config 레퍼런스(Prisma 7): https://www.prisma.io/docs/orm/reference/prisma-config-reference
- SQLite 공식: https://www.sqlite.org/
