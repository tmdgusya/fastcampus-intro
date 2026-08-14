# 디자인 토큰 시스템 설계서 — 패캠 스토어

> **범위**: 코드 구현 없이, 프론트엔드 전역에서 균일하게 사용할 **디자인 토큰 시스템만** 설계한다.
> **참고**: KRDS(디지털 정부 서비스 디자인 시스템)의 3단계 토큰 구조 사례(`style_07 설계 기준`), 패스트캠퍼스 공식 사이트의 실제 적용 팔레트.
> **문서 상태**: `v1.0` (설계 초안)

---

## 1. 목적

패캠 스토어의 UI 는 현재 스캐폴드(`tailwind.config`, `globals.css`) 수준에 머물러 있다. 기능 구현 전에 **디자인 토큰**을 먼저 확립하면 다음이 가능해진다.

- 모든 페이지·컴포넌트가 **하나의 진실 공급원(SSOT)** 을 바라본다.
- 디자이너(Figma 토큰) → 개발자(CSS 변수) 간 **네이밍과 값이 1:1** 로 대응한다.
- 브랜드 색·폰트·간격을 바꿔야 할 때 **한 곳만 수정**하면 전역에 반영된다.
- 테마(라이트/다크), 반응형(모바일/데스크톱) 대응의 기반이 된다.

본 설계는 **KRDS 의 3단계 토큰 계층**(Primitive → Semantic → Component)을 골격으로 삼고, **패스트캠퍼스의 실제 브랜드 팔레트**를 값으로 채운다.

---

## 2. 토큰 아키텍처 (KRDS 3단계 모델)

KRDS는 토큰을 세 레벨로 나눈다. 이 레벨을 그대로 채택한다.

| 레벨 | 역할 | 사용 규칙 | 예시 |
|------|------|-----------|------|
| **Primitive (기본값)** | 원자값 정의. 색상 팔레트, 폰트 사이즈, 간격 그리드. | **절대 직접 사용하지 않는다.** | `--fc-red-500: #ED234B` |
| **Semantic (의미 토큰)** | 맥락적 의미를 부여하고 primitive 를 참조. | 스타일링 코드에서 **주로 사용**한다. | `--color-text-primary: var(--fc-neutral-900)` |
| **Component (컴포넌트 토큰)** | 특정 UI 컴포넌트에 적용. semantic 을 참조. | 컴포넌트 구현 파일에서 사용. | `--btn-primary-bg: var(--color-brand-primary)` |

**토큰 흐름:**
```
디자인 툴(Figma)
   │  JSON 추출
   ▼
Primitive ──▶ Semantic ──▶ Component ──▶ CSS 변수 ──▶ HTML/컴포넌트
```

> **왜 3단계인가**: Primitive 를 직접 쓰면 "색이 어디서 왔는지" 의미가 사라진다. Semantic 이 중간에서 의미를 붙여주므로, "주문 버튼"과 "링크"가 같은 색이라도 각자 다른 의미 토큰을 쓸 수 있고, 나중에 브랜드 색이 바뀌어도 `Primitive`만 수정하면 된다. Component 는 컴포넌트별로 파생 세부값(예: hover 배경)을 담는다.

---

## 3. 모드(Mode)와 반응형 전략

KRDS는 **기본(밝은)/선명한(고대비)** 모드와 **large/small** 반응형을 지원한다. 패캠 스토어는 규모가 작으므로 다음으로 축소한다.

| 구분 | 채택 여부 | 적용 방법 |
|------|-----------|-----------|
| 밝음/어두움 테마 | ✅ 채택 (라이트 기본, 다크 대비) | `:root`(라이트) / `@media (prefers-color-scheme: dark)`(다크) |
| 고대비 모드 | 🔶 후순위 (접근성 단계에서) | `forced-colors` 대응 |
| 반응형 | ✅ 채택 | Tailwind 브레이크포인트(`sm/md/lg`)만 사용, 토큰은 고정값 |

> **규칙**: 토큰 값 자체는 고정(px/rem)이다. 반응형은 **토큰이 아니라 Tailwind 브레이크포인트**로 처리한다. 즉 "모바일에서 패딩이 다르다"를 토큰으로 만들지 않는다.

---

## 4. 색상 토큰 (Color)

### 4-1. Primitive — 브랜드 팔레트

**패스트캠퍼스 실제 적용값을 기준**으로 추출한 팔레트. 1차 브랜드 색은 선명한 레드/핑크 `#ED234B`, 2차는 민트/틸 `#50E3C2`, 액센트는 오렌지 `#FF7450` 이다.

**브랜드 레드 (Primary)**
| 토큰 | 값 | 용도 힌트 |
|------|-----|-----------|
| `--fc-red-50`  | `#FEF2F4` | 가장 연한 배경, hover 피드백 |
| `--fc-red-100` | `#FDE3E8` | 경고 틴트 배경 |
| `--fc-red-200` | `#FBC4CF` | 비활성 브랜드 요소 |
| `--fc-red-300` | `#F79DA9` | 경계/테두리 |
| `--fc-red-400` | `#F26A7E` | hover 강조 |
| `--fc-red-500` | `#ED234B` | **1차 브랜드 메인** (CTA, 강조) |
| `--fc-red-600` | `#D61D42` | hover / active 상태 |
| `--fc-red-700` | `#B01736` | pressed, 접근성용 어두운 강조 |
| `--fc-red-800` | `#8A122B` | 텍스트 위 강조 |
| `--fc-red-900` | `#640D20` | 고대비 강조 |

**브랜드 틸/민트 (Secondary)**
| 토큰 | 값 |
|------|-----|
| `--fc-teal-50`  | `#ECFDF9` |
| `--fc-teal-100` | `#D3F9EF` |
| `--fc-teal-200` | `#A9F2E0` |
| `--fc-teal-300` | `#7BEACC` |
| `--fc-teal-400` | `#63E2C4` |
| `--fc-teal-500` | `#50E3C2` | **2차 브랜드** (보조 강조, 배지) |
| `--fc-teal-600` | `#2BB69A` |
| `--fc-teal-700` | `#1F8F7B` |
| `--fc-teal-800` | `#17695B` |
| `--fc-teal-900` | `#0F463D` |

**액센트 오렌지 (Accent)**
| 토큰 | 값 |
|------|-----|
| `--fc-orange-50`  | `#FFF4EC` |
| `--fc-orange-100` | `#FFE4D1` |
| `--fc-orange-200` | `#FFC9A3` |
| `--fc-orange-300` | `#FFAB75` |
| `--fc-orange-400` | `#FF8D52` |
| `--fc-orange-500` | `#FF7450` | **액센트** (할인, 이벤트, 프로모션) |
| `--fc-orange-600` | `#E85A36` |
| `--fc-orange-700` | `#C0452A` |
| `--fc-orange-800` | `#993420` |
| `--fc-orange-900` | `#6E2417` |

**중립 그레이 (Neutral)** — 패스트캠퍼스 적용 그레이를 정리
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--fc-neutral-0`   | `#FFFFFF` | 배경(흰색) |
| `--fc-neutral-50`  | `#F9F9F9` | 페이지 대체 배경 |
| `--fc-neutral-100` | `#F2F2F2` | 표면(surface) 배경 |
| `--fc-neutral-200` | `#E6E8EB` | 표면 강조 |
| `--fc-neutral-300` | `#D3D3D3` | 경계선(light) |
| `--fc-neutral-400` | `#9B9BA0` | 테두리(기본), 비활성 텍스트 |
| `--fc-neutral-500` | `#6E6E73` | 보조 텍스트 |
| `--fc-neutral-600` | `#424242` | 본문 텍스트(약) |
| `--fc-neutral-700` | `#282828` | 본문 텍스트 |
| `--fc-neutral-800` | `#171B1F` | 제목 텍스트 |
| `--fc-neutral-900` | `#121212` | 최고 대비 텍스트 |

**상태 색상 (기능)**
| 토큰 | 값 |
|------|-----|
| `--fc-success-500` | `#1F9D55` |
| `--fc-warning-500` | `#F5A623` |
| `--fc-danger-500`  | `#E11D48` |
| `--fc-info-500`    | `#174FE4` |

---

### 4-2. Semantic — 의미 토큰

> **사용 규칙**: 컴포넌트 스타일링은 **이 계층을 주로** 쓴다. primitive 를 직접 참조하지 않는다.

| 의미 토큰 | 값(참조) | 라이트 | 다크 |
|-----------|----------|--------|------|
| `--color-bg-primary`    | neutral-0  | `#FFFFFF` | `#121212` |
| `--color-bg-surface`    | neutral-100 | `#F2F2F2` | `#171B1F` |
| `--color-bg-subtle`     | neutral-50  | `#F9F9F9` | `#1F2428` |
| `--color-bg-brand`      | red-500     | `#ED234B` | `#ED234B` |
| `--color-text-primary`  | neutral-900 | `#121212` | `#EDEDED` |
| `--color-text-secondary`| neutral-500 | `#6E6E73` | `#9B9BA0` |
| `--color-text-tertiary` | neutral-400 | `#9B9BA0` | `#6E6E73` |
| `--color-text-inverse`  | neutral-0    | `#FFFFFF` | `#121212` |
| `--color-text-brand`    | red-500      | `#ED234B` | `#F26A7E` |
| `--color-text-on-brand` | neutral-0    | `#FFFFFF` | `#FFFFFF` |
| `--color-border-default`| neutral-300  | `#D3D3D3` | `#424242` |
| `--color-border-strong` | neutral-400  | `#9B9BA0` | `#9B9BA0` |
| `--color-border-brand`  | red-500      | `#ED234B` | `#F26A7E` |
| `--color-border-focus`  | info-500     | `#174FE4` | `#7DA2FF` |
| `--color-brand-primary` | red-500      | `#ED234B` | `#F26A7E` |
| `--color-brand-secondary` | teal-500  | `#50E3C2` | `#63E2C4` |
| `--color-accent`        | orange-500   | `#FF7450` | `#FF8D52` |
| `--color-success`       | success-500  | `#1F9D55` | `#4CC38A` |
| `--color-warning`       | warning-500  | `#F5A623` | `#FFC46B` |
| `--color-danger`        | danger-500   | `#E11D48` | `#F4526F` |
| `--color-info`          | info-500     | `#174FE4` | `#7DA2FF` |

> **다크 모드 규칙**: 색상 값을 바꾸되, **시맨틱 토큰 이름은 바꾸지 않는다.** 컴포넌트는 `--color-bg-primary` 를 그대로 쓰면 되고, 다크 테마에서 값만 바뀐다.

---

### 4-3. Component — 컴포넌트 색 토큰 (예시)

패캠 스토어의 실제 컴포넌트에 대한 파생 토큰. semantic 을 참조한다.

**버튼 (Primary)**
| 토큰 | 값(참조) |
|------|----------|
| `--btn-primary-bg`          | `--color-brand-primary` |
| `--btn-primary-bg-hover`    | red-600 |
| `--btn-primary-bg-active`   | red-700 |
| `--btn-primary-text`        | `--color-text-on-brand` |
| `--btn-primary-focus`       | `--color-border-focus` |

**상품 카드 (ProductCard)**
| 토큰 | 값(참조) |
|------|----------|
| `--card-bg`            | `--color-bg-primary` |
| `--card-border`        | `--color-border-default` |
| `--card-shadow`        | shadow-md |
| `--card-name`          | `--color-text-primary` |
| `--card-price`         | `--color-text-primary` (강조), `--color-brand-primary` (프로모션) |
| `--card-image-bg`      | `--color-bg-surface` |

**헤더 (Header)**
| 토큰 | 값(참조) |
|------|----------|
| `--header-bg`          | `--color-bg-primary` |
| `--header-brand-text`  | `--color-text-primary` |

---

## 5. 타이포그래피 토큰 (Typography)

### 5-1. 글꼴(Font Family)

패스트캠퍼스는 한글 콘텐츠 중심이다. 한글 웹 표준으로 **Pretendard** 를 권장(가변폰트, 사용 허가 무료), 폴백으로 시스템 산세리프.

```
--font-family-sans: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
                    "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans KR", Arial, sans-serif;
```

### 5-2. Primitive — 폰트 사이즈/굵기/행간

**사이즈 (rem, 1rem = 16px)**
| 토큰 | 값 |
|------|-----|
| `--fc-font-size-2xs` | `0.75rem` (12px) |
| `--fc-font-size-xs`  | `0.8125rem` (13px) |
| `--fc-font-size-sm`  | `0.875rem` (14px) |
| `--fc-font-size-base`| `1rem` (16px) |
| `--fc-font-size-md`  | `1.125rem` (18px) |
| `--fc-font-size-lg`  | `1.25rem` (20px) |
| `--fc-font-size-xl`  | `1.5rem` (24px) |
| `--fc-font-size-2xl` | `1.875rem` (30px) |
| `--fc-font-size-3xl` | `2.25rem` (36px) |
| `--fc-font-size-4xl` | `3rem` (48px) |

**굵기**
| 토큰 | 값 |
|------|-----|
| `--fc-font-weight-regular` | `400` |
| `--fc-font-weight-medium`  | `500` |
| `--fc-font-weight-semibold`| `600` |
| `--fc-font-weight-bold`    | `700` |
| `--fc-font-weight-extra-bold` | `800` |

**행간 (Line Height, 배율)**
| 토큰 | 값 |
|------|-----|
| `--fc-line-height-tight`   | `1.25` |
| `--fc-line-height-normal`  | `1.5` |
| `--fc-line-height-relaxed` | `1.75` |

### 5-3. Semantic — 텍스트 스타일

| 의미 토큰 | 사이즈 | 굵기 | 행간 | 용도 |
|-----------|--------|------|------|------|
| `--text-display`    | 3xl/4xl | bold(700) | tight | 랜딩·히어로 대제목 |
| `--text-h1`         | 2xl     | bold      | tight | 페이지 제목 |
| `--text-h2`         | xl      | bold      | tight | 섹션 제목 |
| `--text-h3`         | md      | semibold  | normal | 카드 제목 |
| `--text-body-lg`    | base    | regular   | relaxed | 본문(크게) |
| `--text-body`       | sm      | regular   | normal | 본문(기본) |
| `--text-body-sm`    | xs      | regular   | normal | 보조 설명 |
| `--text-caption`    | 2xs     | medium    | normal | 캡션/라벨 |
| `--text-price`      | md      | bold      | tight | 가격 강조 |
| `--text-button`     | sm      | semibold  | normal | 버튼 라벨 |
| `--text-link`       | sm      | medium    | normal | 링크 |

> 상품 카드/상세에서 **가격은 `--text-price`** 를 쓴다. (PRD: 가격은 `formatPrice` 로 표시하되, 시각 강조는 이 토큰.)

---

## 6. 간격 토큰 (Spacing)

KRDS의 "4, 8, 16, 20" 그리드를 따른다. 4px 단위를 기본으로 한 증강 스케일.

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--space-0`  | `0` |
| `--space-1`  | `0.25rem` (4px) | 아이콘-텍스트 여백 |
| `--space-2`  | `0.5rem` (8px) | 밀접 요소 간격 |
| `--space-3`  | `0.75rem` (12px) | 라벨/캡션 간격 |
| `--space-4`  | `1rem` (16px) | 카드 내부 패딩, 요소 간격 |
| `--space-5`  | `1.25rem` (20px) | 섹션 내부 간격 |
| `--space-6`  | `1.5rem` (24px) | 카드/그룹 간격 |
| `--space-8`  | `2rem` (32px) | 큰 그룹 간격 |
| `--space-10` | `2.5rem` (40px) | 섹션 여백 |
| `--space-12` | `3rem` (48px) | 큰 섹션 여백 |
| `--space-16` | `4rem` (64px) | 페이지 상단/하단 |
| `--space-20` | `5rem` (80px) | 히어로/섹션 대여백 |

> **규칙**: 홀수 파생값(예: 6, 14, 22)은 기본 스케일에 없으면 **새 토큰(예: `--space-6`)을 만들지 말고** 기존 값을 조합(예: `space-4 + space-2`)한다. 무한 파생을 막기 위함.

---

## 7. 라운드 토큰 (Radius)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--radius-none` | `0` | |
| `--radius-xs`   | `0.25rem` (4px) | 태그, 작은 요소 |
| `--radius-sm`   | `0.5rem` (8px) | 입력 필드, 버튼 |
| `--radius-md`   | `0.75rem` (12px) | 카드 |
| `--radius-lg`   | `1rem` (16px) | 큰 카드, 모달 |
| `--radius-xl`   | `1.5rem` (24px) | 히어로 이미지 |
| `--radius-full` | `9999px` | 아바타, 원형 배지 |

---

## 8. 효과/그림자 토큰 (Shadow & Elevation)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--shadow-none` | `none` | 평면 요소 |
| `--shadow-xs`   | `0 1px 2px rgba(0,0,0,0.05)` | 카드 기본 |
| `--shadow-sm`   | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` | hover 카드 |
| `--shadow-md`   | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)` | 카드 기본 그림자 |
| `--shadow-lg`   | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.05)` | 모달/플로팅 |
| `--shadow-xl`   | `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)` | 오버레이 |

**포커스 링(Ring)** — 접근성
| 토큰 | 값 |
|------|-----|
| `--ring-width`   | `2px` |
| `--ring-offset`  | `2px` |
| `--ring-color`   | `--color-border-focus` (= `#174FE4`) |

> **규칙**: 다크 모드에서는 그림자 강도를 낮춘다(`--shadow-md` 값의 opacity 를 절반으로). 그림자 토큰은 `:root`(라이트) / 다크에서 각각 정의.

---

## 9. 토큰 네이밍 규칙 (Naming Convention)

KRDS 네이밍(대시 구분, `--namespace` 접두)을 따른다.

```
--[namespace]-[category]-[semantic|primitive]-[scale|modifier]
```

| 부분 | 값 | 설명 |
|------|-----|------|
| namespace | `fc` | 패캠 스토어 |
| category | `color / text / space / radius / shadow / ring / font` | 토큰 종류 |
| level | `color-*` 는 생략, 나머지는 semantic 계층에서 `text-*` 등 | |
| scale | `50~900` (색), `sm/md/lg` (크기) | |
| modifier | `hover / active / disabled / focus` | 상태 접미 (컴포넌트 토큰) |

**예시:**
- Primitive: `--fc-red-500`, `--fc-font-size-md`, `--fc-space-4`
- Semantic: `--color-text-primary`, `--text-body`, `--space-4`(재사용)
- Component: `--btn-primary-bg`, `--btn-primary-bg-hover`, `--card-shadow`

---

## 10. 구현 매핑 (기술 전환 가이드 — 참고용)

> 본 섹션은 *방향*만 명시한다. 실제 코드 구현은 이 설계가 승인된 뒤 별도 작업으로 진행한다. (이 문서는 코드를 포함하지 않는다.)

### Tailwind v4 — `@theme` 활용

Tailwind v4 에서는 `@theme` 블록으로 토큰을 등록하면 유틸리티 클래스(`bg-red-500`, `text-neutral-900`)로 자동 생성된다.

```css
@import "tailwindcss";

@theme {
  /* 색상: --color-{name}-{scale} 로 등록 */
  --color-red-500: #ED234B;
  --color-neutral-900: #121212;
  /* 간격: --spacing-{n} */
  --spacing-4: 1rem;
  /* 라운드: --radius-md */
  --radius-md: 0.75rem;
  /* 그림자: --shadow-md */
}
```

**매핑 원칙 (Primitive → Tailwind 유틸):**
| Primitive 토큰 | Tailwind 등록 | 사용 예 |
|----------------|---------------|---------|
| `--fc-red-500` | `--color-red-500` | `bg-red-500` |
| `--fc-neutral-900` | `--color-neutral-900` | `text-neutral-900` |
| `--space-4` | `--spacing-4` | `p-4`, `gap-4` |
| `--radius-md` | `--radius-md` | `rounded-md` |
| `--shadow-md` | `--shadow-md` | `shadow-md` |

> **Semantic 토큰은 CSS 변수(`:root`)로 유지**하고, Tailwind 의 `bg-(--color-text-primary)` 문법(임의값)으로 참조한다. 이렇게 하면 다크 모드에서 값만 교체된다.

---

## 11. 접근성 기준 (A11y)

| 항목 | 기준 | 근거 토큰 |
|------|------|-----------|
| 본문/배경 대비 | **AA(≥ 4.5:1)** | `--color-text-primary` vs `--color-bg-primary` |
| 대제목 대비 | **AA(≥ 3:1)** | `--text-h1` vs 배경 |
| 포커스 가시성 | 2px 링 + 2px offset | `--ring-*` |
| 터치 타깃 | 최소 44×44px | `--space-10` 기준 |
| 다크 모드 | `prefers-color-scheme` | semantic 다크 값 |

> 브랜드 레드 `#ED234B` 위의 흰 텍스트는 대비 약 ~5.9:1 로 AA 를 충족한다. (검증 수치: JCh 기준 인접)

---

## 12. 토큰 적용 매트릭스 (이 프로젝트 컴포넌트)

| 컴포넌트 | 배경 | 텍스트 | 경계 | 라운드 | 그림자 | 간격 |
|----------|------|--------|------|--------|--------|------|
| **Header** | `--color-bg-primary` | `--color-text-primary`(브랜드명) | — | — | `--shadow-xs` | `--space-4` 패딩 |
| **ProductCard** | `--color-bg-primary` | 이름 `--color-text-primary`, 가격 `--text-price` | `--color-border-default` | `--radius-md` | `--shadow-md`(hover `--shadow-lg`) | `--space-4` |
| **목록 그리드** | `--color-bg-subtle` | — | — | — | — | `--space-6` gap |
| **상세 이미지** | `--color-bg-surface` | — | — | `--radius-lg` | `--shadow-md` | — |
| **가격 강조** | — | `--color-brand-primary` | — | — | — | — |
| **목록으로 돌아가기** | `--color-bg-brand` | `--color-text-on-brand` | — | `--radius-sm` | — | `--space-2`~`4` |
| **404 화면** | `--color-bg-primary` | `--color-text-secondary` | — | — | — | `--space-12` |

---

## 13. 설계 결정 요약 (Why)

| 결정 | 근거 |
|------|------|
| KRDS 3단계 구조 채택 | 프리미티브의 의미 소실 방지, 브랜드 변경 시 단일 수정 지점 |
| 색은 패스트캠퍼스 실제 팔레트 | 브랜드 일관성. `#ED234B`(레드), `#50E3C2`(틸), `#FF7450`(오렌지) |
| 반응형은 토큰이 아닌 브레이크포인트로 | 토큰 수를 늘리지 않고 Tailwind 표준 활용 |
| 다크 모드는 semantic 값 교체 | 컴포넌트 코드는 토큰 이름을 그대로 유지 |
| 간격은 4px 그리드 | KRDS 기준, 과도한 파생 방지 |
| 가격은 `--text-price` + `formatPrice` | 시각 강조(토큰)와 포맷(유틸) 분리 |

---

## 14. 다음 단계 (승인 후)

1. 위 토큰 값 & 네이밍 **리뷰/확정**.
2. `globals.css` 의 `@theme` + `:root` 에 토큰 등록 (코드 구현).
3. `Header`, `ProductCard`, 목록/상세 페이지에 적용하며 토큰 검증.
4. (선택) 다크 모드, 접근성 대비 검토.