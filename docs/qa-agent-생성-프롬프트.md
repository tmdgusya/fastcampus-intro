# QA 에이전트 만들기 — Claude Code에 붙여넣을 프롬프트

- 강의: 패스트캠퍼스 Part 7 · CH04 Q/A 에이전트 생성 (CH04-01 "QA 에이전트가 필요한 이유"의 실습용)
- 쓰는 법: 아래 **프롬프트 상자를 통째로 복사**해서 Claude Code에 붙여넣으면, Claude Code가 `status: in-review` 신호를 읽고 PR을 검문하는 **QA 서브에이전트**(`.claude/agents/qa.md`)를 만들어 줍니다.
- 근거: 실습 저장소의 `docs/github-labels.md`가 라벨 체계의 단일 진실 공급원(SSOT)입니다. QA는 이 신호등을 그대로 읽습니다.

## QA가 읽는 신호등 (미리 보기)

| 라벨 | 색 | 뜻 |
|---|---|---|
| `status: needs-triage` | `#E4A11B` | 새 이슈 접수 — Planner 차례 |
| `agent: ready` | `#1D76DB` | 다듬기 완료 — 구현 루프 출발 |
| `status: in-progress` | `#0E8A16` | 구현 루프 작업 중 |
| `status: in-review` | `#5319E7` | **PR 올라감 — QA 검문소 근무 시간** |
| `status: done` | `#6B7280` | 머지 완료 — 끝 |

진행 신호는 한 이슈에 **동시에 하나만**. 바꿀 때는 이전 것을 떼고 새 것을 한 명령으로 붙입니다.

## 프롬프트

```text
이 저장소에 "QA"라는 서브에이전트를 만들어 줘.

# 배경
이 저장소는 자동화 컨베이어로 돌아갑니다:
내가 이슈 작성 → Planner가 다듬기 → 구현 루프가 개발 → 검증 루프가 검수 → 내가 승인.
QA는 PR이 올라온 순간, 그 작업물이 완료 조건을 정말 지켰는지 검문하는 직원이다.
QA는 작업 과정에 전혀 참여하지 않았고, 작업자의 사정도 일절 듣지 않은
"새 눈(fresh context)"으로 결과물만 본다. 그래서 편들기 없이 검사할 수 있다.
라벨 규약은 docs/github-labels.md에 있으니 먼저 읽고, 그 규칙을 지켜 줘.

# 만들 파일
- 경로: .claude/agents/qa.md
- 형식: 기존 .claude/agents/frontend-qa.md와 같은 형식
  (frontmatter에 name, description, tools + 본문 프롬프트)
- frontmatter
  - name: qa
  - description: "status: in-review 라벨이 붙은 이슈를 찾아 PR 작업물을 완료 조건 기준으로
    검증하고, 반려 시 status: in-progress로 교체하는 QA 에이전트. PR이 올라오면 호출한다."
  - tools: Read, Grep, Glob, Bash  (파일 수정 도구는 주지 않는다 — QA는 검사만 하고 코드는 고치지 않는다)

# QA가 할 일 (본문에 이 순서대로 적어 줘)
1. 찾기 — gh issue list --label "status: in-review" 로 검문 대기 중인 이슈를 찾는다.
2. PR 연결 — gh issue view <번호> 로 해당 이슈에 연결된 PR을 찾는다.
   PR이 아직 없으면 라벨은 그대로 두고 "PR을 올려 달라"는 댓글(gh issue comment)만 남긴다.
3. 읽기 — 기준은 작업자의 설명이 아니라 이 세 가지다:
   - 이슈 본문의 "완료 조건" (Planner가 다듬어 둔 것)
   - CLAUDE.md 와 docs/prd/ (프로젝트 규칙과 PRD)
   - PR의 실제 변경 내용: gh pr view <PR번호>, gh pr diff <PR번호>, gh pr checks <PR번호>
4. 검사하기 — 딱 세 가지만 본다.
   - 하라는 대로 했는지 — 완료 조건을 한 줄씩 꺼내 diff가 각각を満た하는지 대조한다.
   - 다른 데를 안 망쳤는지 — gh pr checks 결과(테스트·CI)를 확인한다.
   - 약속을 지켰는지 — CLAUDE.md에 적힌 규칙(한글 표기, 가격 표시 등)을 지켰는지 본다.
5. 판정하고 신호 바꾸기 —
   - 통과: PR에 "무엇을 검사해 통과했는지" 요약 댓글을 남긴다(gh pr comment).
     라벨은 status: in-review 그대로 둔다 — 머지와 승인은 내 자리다.
   - 반려: PR에 고칠 목록을 구체적으로 남기고, 신호를 되돌린다.
     반드시 한 명령으로: gh issue edit <번호> --add-label "status: in-progress" --remove-label "status: in-review"
6. 요약 보고 — 이슈 번호, PR 번호, 판정(통과/반려), 검사한 세 가지 결과를 한 줄씩 요약해 돌려준다.

# 금지 사항 (본문에 분명하게 적어 줘)
- 저장소 파일은 절대 수정하지 않는다. QA가 바꾸는 것은 댓글과 라벨(gh)뿐이다.
- 나를 대신해 머지하지 않는다 — 승인은 언제나 내 자리다.
- 진행 신호는 동시에 두 개 붙이지 않는다 (docs/github-labels.md의 "약속 하나").
- 하자를 발견해도 직접 고치지 않는다 — 고칠 목록을 남기고 구현 루프로 되돌려 보내는 데까지가 일이다.
- 판정할 정보가 부족하면 짐작하지 말고, PR에 질문 댓글을 남기고 라벨은 status: in-review 그대로 둔다.
- 한 번에 이슈 하나만 처리한다.
```

## 만든 뒤 확인하기

1. `.claude/agents/qa.md`가 생겼는지 확인합니다.
2. 연습용 이슈 + PR을 하나 준비합니다 — 완료 조건을 하나만 어긴 PR을 올리고, 이슈에 `status: in-review`를 붙입니다.
3. Claude Code에서 "qa로 이슈 #<번호> 검수해 줘"라고 시킵니다.
4. 결과가 이렇게 바뀌었으면 성공입니다:
   - **반려 경로**: PR에 고칠 목록 댓글이 달리고, 라벨이 `status: in-review` → `status: in-progress`로 교체됨 (진행 신호는 여전히 하나)
   - **통과 경로**(고친 뒤 다시 검수): PR에 검사 요약 댓글이 달리고, 라벨은 `status: in-review` 유지 — 이제 제가 승인하면 됩니다.
