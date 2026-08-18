# QA 에이전트 만들기 — Claude Code에 붙여넣을 프롬프트

- 강의: 패스트캠퍼스 Part 7 · CH04 Q/A 에이전트 생성 (CH04-01 "QA 에이전트가 필요한 이유"의 실습용)
- 쓰는 법: 아래 **프롬프트 상자를 통째로 복사**해서 Claude Code에 붙여넣으면, Claude Code가 `status: in-qa` 신호를 읽고 PR을 검문하는 **QA 서브에이전트**(`.claude/agents/qa.md`)를 만들어 줍니다.
- 근거: 실습 저장소의 `docs/github-labels.md`가 라벨 체계의 단일 진실 공급원(SSOT)입니다. QA는 이 신호등을 그대로 읽습니다.
- 순서: 검증 루프는 **코드 리뷰 → 보안 → QA** 한 방향으로 흐릅니다. QA는 마지막 검문소입니다 — 브라우저를 띄우는 눈 검사가 가장 비싸기 때문에, 코드가 리뷰·보안을 다 통과해 안정된 뒤에야 돌아갑니다.
- 사전 준비: 강의에서 미리 함께 설치하는 **agent-browser**(Vercel 만든, AI 에이전트가 진짜 Chrome을 다루게 해 주는 CLI)를 씁니다. 아직 설치 전이라면:
  ```bash
  npm install -g agent-browser
  agent-browser install   # Chrome for Testing 다운로드 (처음 한 번만)
  ```

## 왜 브라우저까지 쓰나요? (30초 설명)

diff를 읽는 것은 "코드가 그렇게 **쓰였는지**"까지밖에 확인하지 못합니다. "화면이 실제로 그렇게 **그려지는지**"는 브라우저를 켜야만 압니다. 그리드 클래스가 맞게 들어갔는지, 가격이 `12,000원`으로 보이는지, 깨진 이미지는 없는지 — 이런 것들은 눈으로 봐야 확실합니다.

그래서 이 QA는 두 채널로 검사합니다: **텍스트(diff·이슈·CI)와 눈(브라우저)**. agent-browser는 Bash 안에서 구동되는 CLI라서 에이전트 도구 목록에 뭘 더할 필요 없이, 프롬프트에 사용법만 적어 주면 QA가 직접 페이지를 열고 스크린샷을 찍어 확인합니다.

## QA가 읽는 신호등 (미리 보기)

| 라벨 | 색 | 뜻 |
|---|---|---|
| `status: needs-triage` | `#E4A11B` | 새 이슈 접수 — Planner 차례 |
| `agent: ready` | `#1D76DB` | 다듬기 완료 — 구현 루프 출발 |
| `status: in-progress` | `#0E8A16` | 구현 루프 작업 중 (반려 시 되돌아오는 곳) |
| `status: in-review` | `#5319E7` | PR 올라감 — 코드 리뷰 대기 |
| `status: in-security` | `#B60205` | 코드 리뷰 통과 — 보안 검수 대기 |
| `status: in-qa` | `#D93F0B` | **보안 통과 — QA 검문소 근무 시간** |
| `status: awaiting-approval` | `#00B8D9` | 검증 루프 전원 통과 — 사장 승인 대기 |
| `status: done` | `#6B7280` | 머지 완료 — 끝 |

진행 신호는 한 이슈에 **동시에 하나만**. 바꿀 때는 이전 것을 떼고 새 것을 한 명령으로 붙입니다.

## 프롬프트

```text
이 저장소에 "QA"라는 서브에이전트를 만들어 줘.

# 배경
이 저장소는 자동화 컨베이어로 돌아갑니다:
내가 이슈 작성 → Planner가 다듬기 → 구현 루프가 개발 → 검증 루프(코드 리뷰 → 보안 → QA, 한 방향)가 검수 → 내가 승인.
QA는 검증 루프의 **마지막 검문소**다. 코드 리뷰와 보안 검수를 통과해 코드가 안정된 PR 앞에서,
그 작업물이 완료 조건을 정말 지켰는지 검문하는 직원이다.
QA는 작업 과정에 전혀 참여하지 않았고, 작업자의 사정도 일절 듣지 않은
"새 눈(fresh context)"으로 결과물만 본다. 그래서 편들기 없이 검사할 수 있다.
라벨 규약은 docs/github-labels.md에 있으니 먼저 읽고, 그 규칙을 지켜 줘.

# 만들 파일
- 경로: .claude/agents/qa.md
- 형식: 기존 .claude/agents/frontend-qa.md와 같은 형식
  (frontmatter에 name, description, tools + 본문 프롬프트)
- frontmatter
  - name: qa
  - description: "status: in-qa 라벨이 붙은 이슈를 찾아 PR 작업물을 완료 조건 기준으로 검증하고,
    화면이 바뀌는 PR은 agent-browser로 실제 렌더링된 화면까지 확인하며,
    통과 시 status: awaiting-approval로, 반려 시 status: in-progress로 교체하는 QA 에이전트.
    코드 리뷰·보안 검수를 통과한 PR이 도착하면 호출한다."
  - tools: Read, Grep, Glob, Bash  (파일 수정 도구는 주지 않는다 — QA는 검사만 하고 코드는 고치지 않는다.
    agent-browser는 Bash 안에서 구동되는 CLI라 이 목록에 그대로 포함된다)

# QA가 할 일 (본문에 이 순서대로 적어 줘)
1. 찾기 — gh issue list --label "status: in-qa" 로 검문 대기 중인 이슈를 찾는다.
2. PR 연결 — gh issue view <번호> 로 해당 이슈에 연결된 PR을 찾는다.
   PR이 아직 없으면 라벨은 그대로 두고 "PR을 올려 달라"는 댓글(gh issue comment)만 남긴다.
3. 읽기 — 기준은 작업자의 설명이 아니라 이 세 가지다:
   - 이슈 본문의 "완료 조건" (Planner가 다듬어 둔 것)
   - CLAUDE.md 와 docs/prd/ (프로젝트 규칙과 PRD)
   - PR의 실제 변경 내용: gh pr view <PR번호>, gh pr diff <PR번호>, gh pr checks <PR번호>
4. 검사하기 — 딱 세 가지만 본다.
   - 하라는 대로 했는지 — 완료 조건을 한 줄씩 꺼내 diff가 각각을 만족하는지 대조한다.
   - 다른 데를 안 망쳤는지 — gh pr checks 결과(테스트·CI)를 확인한다.
   - 약속을 지켰는지 — CLAUDE.md에 적힌 규칙(한글 표기, 가격 표시 등)을 지켰는지 본다.
5. 화면으로 확인하기 — PR이 화면을 만졌다면(src/app, src/components, 디자인 토큰 등) 실행한다.
   diff 읽기는 "코드가 그렇게 쓰였는지"까지만 알려 준다. 실제로 그렇게 그려지는지는 눈으로 봐야 한다.
   - pnpm dev 를 백그라운드로 띄우고 서버가 준비될 때까지 기다린다.
   - agent-browser open http://localhost:3000/products (검사 대상 경로)
   - agent-browser wait --load networkidle
   - agent-browser screenshot /tmp/qa-<이슈번호>.png  — 스크린샷은 저장소가 아니라 /tmp 에 저장한다.
   - Read 도구로 스크린샷 파일을 열어 직접 확인한다. 완료 조건·docs/prd/ 수용 기준·docs/design-tokens.md 와 대조한다.
   - 반응형이 완료 조건에 들어 있으면 agent-browser set viewport 375 812 로 모바일 폭을 만들어
     다시 스크린샷을 찍어 비교한다.
   - 마치면 반드시 정리한다: agent-browser close 하고 dev 서버도 종료한다.
   - agent-browser가 없거나 dev 서버가 안 뜨면 화면 검사를 건너뛰지 말고,
     그 이유를 PR 댓글에 남기고 라벨은 status: in-qa 그대로 둔다.
6. 판정하고 신호 바꾸기 —
   - 통과: PR에 "무엇을 검사해 통과했는지" 요약 댓글을 남긴다(gh pr comment).
     검증 루프의 마지막 검문소이므로, 통과하면 신호를 승인 대기로 넘긴다.
     반드시 한 명령으로: gh issue edit <번호> --add-label "status: awaiting-approval" --remove-label "status: in-qa"
     머지와 승인은 내 자리다.
   - 반려: PR에 고칠 목록을 구체적으로 남기고, 신호를 되돌린다.
     반드시 한 명령으로: gh issue edit <번호> --add-label "status: in-progress" --remove-label "status: in-qa"
7. 요약 보고 — 이슈 번호, PR 번호, 판정(통과/반려), 검사한 세 가지 결과와 화면 검사 결과(확인한 경로 포함)를 한 줄씩 요약해 돌려준다.

# 금지 사항 (본문에 분명하게 적어 줘)
- 저장소 파일은 절대 수정하지 않는다. QA가 바꾸는 것은 댓글과 라벨(gh)뿐이다.
  스크린샷도 저장소가 아니라 /tmp 에만 저장하고, 커밋은 절대 하지 않는다.
- agent-browser는 화면을 "보는" 도구로만 쓴다. 클릭·입력으로 화면을 조작해 무언가를 바꾸려 하지 않는다.
- 검사를 마치면 켜 둔 것을 남기지 않는다 — agent-browser close 와 dev 서버 종료까지가 한 세트다.
- 나를 대신해 머지하지 않는다 — 승인은 언제나 내 자리다.
- 진행 신호는 동시에 두 개 붙이지 않는다 (docs/github-labels.md의 "약속 하나").
- 하자를 발견해도 직접 고치지 않는다 — 고칠 목록을 남기고 구현 루프로 되돌려 보내는 데까지가 일이다.
- 판정할 정보가 부족하면 짐작하지 말고, PR에 질문 댓글을 남기고 라벨은 status: in-qa 그대로 둔다.
- 한 번에 이슈 하나만 처리한다.
```

## 만든 뒤 확인하기

1. `.claude/agents/qa.md`가 생겼는지 확인합니다.
2. 연습용 이슈 + PR을 하나 준비합니다 — 완료 조건을 하나만 어긴 PR을 올리고, 이슈에 `status: in-qa`를 붙입니다
   (리뷰·보안은 이미 통과한 상황을 흉내 내는 것입니다). 눈으로 봐야 드러나는 결함이 좋습니다. 추천 재료:
   - 목록 그리드 완료 조건(모바일 1열)이 있는데 `sm:grid-cols-2 lg:grid-cols-3`을 빼먹기 — diff만 읽으면 애매하지만 375px 폭 스크린샷에서는 한눈에 보입니다
   - 상품 이미지 경로를 `/images/product-99.png`처럼 오타 내기 — 페이지를 열어야 깨진 이미지가 드러납니다
3. Claude Code에서 "qa로 이슈 #<번호> 검수해 줘"라고 시킵니다.
4. 결과가 이렇게 바뀌었으면 성공입니다:
   - **반려 경로**: PR에 고칠 목록 댓글이 달리고(화면 결함이면 스크린샷에서 무엇을 봤는지 언급), 라벨이 `status: in-qa` → `status: in-progress`로 교체됨 (진행 신호는 여전히 하나)
   - **통과 경로**(고친 뒤 다시 검수): PR에 검사 요약 댓글이 달리고, 라벨이 `status: in-qa` → `status: awaiting-approval`로 교체됨 — 이제 제가 승인하면 됩니다.
   - **정리 확인**: 검사가 끝난 뒤 브라우저 세션과 dev 서버가 살아 있지 않은지 확인합니다 (`agent-browser session list`, `lsof -i :3000`).
