# GitHub 이슈 라벨 — 우리 저장소의 신호등

이슈에 붙는 라벨은 **에이전트가 읽는 신호등**입니다. "이 이슈를 누가, 언제 가져가는가"를
색과 이름으로 정해 둔 약속이며, Planner 루프·구현 루프·검증 루프의 검문소들은 이 라벨만 보고 자기 일을 찾습니다.

> 출처: 패스트캠퍼스 Part 7 · CH02-01 "Github Label 설명 및 설정".
> 라벨을 바꾸고 싶다면 이 문서도 함께 고치세요. **이 문서가 라벨 체계의 단일 진실 공급원(SSOT)입니다.**

---

## 한눈에 보기 — 진행 신호 8개 + 종류 스티커 3개

### 진행 신호 (status) — 이슈의 진행 상황

| 라벨 | 색 | 뜻 | 붙이는 주체 |
|---|---|---|---|
| `status: needs-triage` | 🟡 `#E4A11B` | 새 이슈 접수됨 — Planner가 다듬을 차례 | 나 (이슈를 적을 때) |
| `agent: ready` | 🔵 `#1D76DB` | 다듬기 완료 — 구현 루프 출발 신호 | Planner 루프 |
| `status: in-progress` | 🟢 `#0E8A16` | 구현 루프가 작업 중 | 구현 루프 |
| `status: in-review` | 🟣 `#5319E7` | PR 올라감 — **코드 리뷰** 대기 | 구현 루프 |
| `status: in-security` | 🔴 `#B60205` | 코드 리뷰 통과 — **보안 검수** 대기 | 코드 리뷰어 (통과 시) |
| `status: in-qa` | 🟠 `#D93F0B` | 보안 검수 통과 — **QA 검문** 대기 | 보안 검수원 (통과 시) |
| `status: awaiting-approval` | 🔷 `#00B8D9` | 검증 루프 전원 통과 — 내 승인 대기 | QA (통과 시) |
| `status: done` | ⚪ `#6B7280` | 머지 완료 — 끝 | 나 (승인할 때) |

핵심 신호는 **`agent: ready`** — 이 파란 신호가 켜져야 구현 루프가 출발합니다.
(`triage` = 걸러 분류하기)

### 종류 스티커 (type) — 이슈의 종류

| 라벨 | 색 | 뜻 |
|---|---|---|
| `type: bug` | 🔴 `#D73A4A` | 버그 — 예상과 다르게 동작함 |
| `type: feature` | 🔵 `#A2EEEF` | 새 기능 |
| `type: polish` | 🌸 `#F9D0C4` | 다듬기·개선 |

종류 스티커는 나 또는 Planner가 함께 붙입니다. 진행 신호와 달리 여러 개 붙어도 됩니다
("버그이면서 화면 다듬기"도 OK).

---

## 워크플로 — 라벨이 바뀌는 자리가 신호등 자리

```
① 내가 이슈 작성        →  status: needs-triage  (+ type 스티커)
        ↓
② Planner 루프          →  이슈를 다듬고 PRD 작성
                            needs-triage 떼고  agent: ready  붙임
        ↓
③ 구현 루프             →  agent: ready 이슈를 집어 코드·테스트·PR
                            ready 떼고  status: in-progress  붙임
                            PR을 올리면  in-progress 떼고  status: in-review
        ↓
④ 검증 루프 — 검문소 셋이 한 방향으로만 흐른다 (코드 리뷰 → 보안 → QA)
                            코드 리뷰어: in-review 통과 시      status: in-security
                            보안 검수원: in-security 통과 시   status: in-qa
                            QA: in-qa 통과 시                   status: awaiting-approval
                            어느 검문소에서 반려되든           status: in-progress 로 되돌아감
        ↓
⑤ 내가 승인             →  머지,  awaiting-approval 떼고  status: done  붙임, 이슈 닫기
```

각 루프가 **어떤 라벨을 보는지**:

- **Planner 루프**는 `status: needs-triage`를 봅니다 → 이슈를 다듬고 `agent: ready`로 바꿔 붙입니다.
- **구현 루프**는 `agent: ready`를 봅니다 → 작업을 시작하고 `status: in-progress`, PR을 올리면 `status: in-review`.
- **코드 리뷰어**는 `status: in-review`를 봅니다 → 통과하면 `status: in-security`, 반려하면 `status: in-progress`.
- **보안 검수원**은 `status: in-security`를 봅니다 → 통과하면 `status: in-qa`, 반려하면 `status: in-progress`.
- **QA**는 `status: in-qa`를 봅니다 → 통과하면 `status: awaiting-approval`, 반려하면 `status: in-progress`.
- **나(사장)** 는 `status: awaiting-approval`을 봅니다 → PR을 확인하고 승인, `status: done`으로 마무리합니다.

### ⚠️ 약속 하나 — 진행 신호는 한 이슈에 딱 하나만

진행 신호(`status:*` 계열과 `agent: ready`)는 **동시에 두 개 붙이면 안 됩니다.**
신호가 바뀔 때는 **이전 것을 떼고 새 것을 붙입니다.**
두 개가 같이 붙으면 두 루프가 동시에 달려드는 사고가 납니다.

```bash
# 좋은 예: 한 번에 교체
gh issue edit 12 --add-label "agent: ready" --remove-label "status: needs-triage"
```

### ⚠️ 약속 둘 — 검증은 한 방향으로만 흐른다

검문소는 **코드 리뷰 → 보안 → QA** 순서로만 지나갑니다. 뒤로 거슬러 올라가는 간선은 없습니다.
이 순서에는 이유가 있습니다.

- QA의 눈 검사(브라우저 띄우기·스크린샷·대조)는 검증 절차 중 **가장 비쌉니다.**
  코드 리뷰로 뒤집힐 것이 뻔한 PR에 미리 돌리면 그 비용이 전부 낭비됩니다.
- 리뷰·보안의 반려 지적은 "코드를 다시 쓰게 만드는" 것들입니다.
  코드가 바뀔 수 있는 동안은 비싼 게이트로 보내지 않는 것입니다.

여기서 나오는 규칙 두 가지:

1. **반려는 언제나 `status: in-progress`로 돌아갑니다.**
   어떤 검문소의 반려든 똑같습니다. QA가 반렸다고 바로 앞 검문소로 되돌리는 간선은 없습니다.
2. **다시 올라온 PR은 `status: in-review`부터 전 검문소를 다시 통과합니다.**
   QA 반려 후의 자잘한 수정도 코드가 바뀐 이상 리뷰를 다시 받습니다.
   수정이 작으면 리뷰도 빨리 끝나므로 비용 걱정이 없고, "이 수정은 어디까지 재검해야 하나"라는
   회색 지대가 아예 생기지 않습니다.

---

## 이름 규칙

1. **소문자 + 접두어**로 통일합니다 — `status: ready`와 `Status-Ready`가 섞이면 검색이 깨집니다.
2. **같은 묶음은 같은 접두어** — 진행 상황은 `status:`, 종류는 `type:`.
   (`agent: ready`는 "에이전트가 출발해도 된다"는 전용 신호라 `agent:` 접두어를 씁니다.)
3. **설명을 꼭 적습니다** — "이 라벨을 붙이면 무슨 일이 일어나는가" 한 줄. 사람과 에이전트 모두가 읽는 약속입니다.
4. **색은 신호의 언어** — 노랑=접수 · 파랑=출발 · 초록=작업 중 · 보라=코드 리뷰 · 적갈색=보안 · 주황=QA · 하늘색=승인 대기 · 회색=끝. 색만 봐도 진행 상황이 읽힙니다.
5. **적게 시작합니다** — 부족하면 그때 더합니다. 새 라벨 = 새 신호이므로 반드시 이 문서에 먼저 추가하세요.

---

## 명령어 치트시트 (gh CLI)

```bash
# 라벨 목록 보기
gh label list

# 이슈에 라벨 붙이기 / 떼기 (교체는 한 명령으로)
gh issue edit 12 --add-label "status: in-progress"
gh issue edit 12 --remove-label "agent: ready"

# 라벨로 이슈 모아보기 (터미널)
gh issue list --label "agent: ready"
gh issue list --label "status: in-progress"

# 새 라벨 만들기 (체계에 추가할 일이 생기면)
gh label create "이름" --color 6자리HEX --description "한 줄 설명"
```

GitHub 웹 검색창에서는 `label:` 필터를 씁니다. **공백이 있는 라벨은 따옴표로**:

```text
label:"agent: ready"                → 구현 루프 출발 대기열
label:"status: in-review"           → 코드 리뷰 대기열
label:"status: in-security"         → 보안 검수 대기열
label:"status: in-qa"               → QA 검문 대기열
label:"status: awaiting-approval"   → 내 승인 대기열
label:"type: bug"                   → 버그만
```

---

## 부록 — Planner 에이전트 만들기 (Claude Code에 붙여넣을 프롬프트)

Part 7 · CH02-02에서 쓰는 프롬프트입니다. 아래 상자를 통째로 복사해서 Claude Code에 붙여넣으면,
Claude Code가 `status: needs-triage` 이슈를 다듬는 **Planner 서브에이전트**(`.claude/agents/planner.md`)를 만들어 줍니다.

```text
이 저장소에 "Planner"라는 서브에이전트를 만들어 줘.

# 배경
이 저장소는 자동화 컨베이어로 돌아갑니다:
내가 이슈 작성 → Planner가 다듬기 → 구현 루프가 개발 → 검증 루프가 검수 → 내가 승인.
Planner는 대충 적힌 이슈를, 구현 루프가 바로 착수할 수 있는 "작업 설계도"로 다듬는 직원입니다.
라벨 규약은 docs/github-labels.md에 있으니 먼저 읽고, 그 규칙을 지켜 줘.

# 만들 파일
- 경로: .claude/agents/planner.md
- 형식: 기존 .claude/agents/frontend-qa.md와 같은 형식
  (frontmatter에 name, description, tools + 본문 프롬프트)
- frontmatter
  - name: planner
  - description: "status: needs-triage 라벨이 붙은 이슈를 찾아 프로젝트 맥락에 맞게 다듬고,
    agent: ready 신호로 교체하는 Planner 에이전트. 이슈 정리가 필요할 때 호출한다."
  - tools: Read, Grep, Glob, Bash  (파일 수정 도구는 주지 않는다 — Planner는 코드를 고치지 않는다)

# Planner가 할 일 (본문에 이 순서대로 적어 줘)
1. 찾기 — gh issue list --label "status: needs-triage" 로 접수된 이슈를 찾는다.
2. 읽기 — 이슈 본문과 프로젝트 맥락을 읽는다:
   CLAUDE.md, docs/prd/README.md, docs/github-labels.md, docs/design-tokens.md,
   그리고 이슈와 관련된 소스 파일.
3. 다듬기 — 이슈 제목과 본문을 다음 형식으로 다시 쓴다.
   - 제목: "상품 상세: 이미지·본문 간격과 가격 표시 정리"처럼 한눈에 읽히는 한 가지 일
   - 본문은 네 마디:
     - 목표 — 이 작업이 끝나면 어떤 상태가 되는지 한 문장
     - 범위 — 어디까지 손대고, 어디는 손대지 않는지
     - 완료 조건 — 기계적으로 확인 가능한 조건 2~4개
     - 참고 — 구현할 때 읽어야 할 PRD·소스 파일 경로
   - gh issue edit <번호> --title "..." --body "..." 로 반영한다.
4. 종류 스티커 — 이슈 종류를 판단해 type: bug / type: feature / type: polish 중 하나를 붙인다.
5. 신호 교체 — status: needs-triage 를 떼고 agent: ready 를 붙인다.
   반드시 한 명령으로: gh issue edit <번호> --add-label "agent: ready" --add-label "type: ..." --remove-label "status: needs-triage"
6. 요약 보고 — 이슈 번호, 바뀐 제목, 목표·범위·완료 조건을 한 줄씩 요약해 돌려준다.

# 금지 사항 (본문에 분명하게 적어 줘)
- 저장소 파일은 절대 수정하지 않는다. Planner가 바꾸는 것은 이슈(gh issue edit)뿐이다.
- 진행 신호는 동시에 두 개 붙이지 않는다 (docs/github-labels.md의 "약속 하나").
- 범위나 완료 조건을 판단할 정보가 부족하면 짐작하지 말고,
  이슈에 질문 댓글(gh issue comment)을 남기고 라벨은 needs-triage 그대로 둔다.
- 한 번에 이슈 하나만 처리한다.
```

### 만든 뒤 확인하기

1. `.claude/agents/planner.md`가 생겼는지 확인합니다.
2. 연습 이슈를 하나 만듭니다: 일부러 대충 적고(예: "상세 페이지 다듬기 필요. 사진이랑 글자가 너무 붙어 있음.")
   `status: needs-triage` + `type: polish`를 붙입니다.
3. Claude Code에서 "planner로 이슈 #<번호> 다듬어 줘"라고 시킵니다.
4. 결과가 이렇게 바뀌었으면 성공입니다:
   - 제목·본문이 `목표 / 범위 / 완료 조건 / 참고` 형식으로 다듬어짐
   - 라벨이 `status: needs-triage` → `agent: ready`로 교체됨 (진행 신호는 여전히 하나)

---

## GitHub 기본 라벨 정리 현황

새 저장소에 기본으로 들어오는 9장 중 우리 체계와 겹치는 것만 정리했습니다.

- **유지**: `documentation` · `enhancement` · `good first issue` · `help wanted` · `question` — 우리 체계와 안 겹칩니다.
- **변경**: 기본 `bug` → `type: bug`로 이름 변경 (우리 규칙에 맞춤).
- **삭제**: `duplicate` · `invalid` · `wontfix` — 혼자 쓰는 저장소엔 아직 필요 없음. 필요하면 언제든 다시 만들 수 있습니다.
