"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import {
  getSession,
  signOut,
  subscribeAuth,
  type AuthSession,
} from "@/lib/auth";

/** SSR·하이드레이션 중에는 세션이 없다고 렌더한다. (localStorage 접근 불가) */
function getServerSessionSnapshot(): AuthSession | null {
  return null;
}

/**
 * 공통 헤더. 사이트명 "패캠 스토어"를 좌측에 노출하고, 클릭 시 `/products` 로 이동한다.
 * 로그인 상태(localStorage 목업)에 따라 우측에 로그인·회원가입 링크 또는 사용자 이메일·로그아웃 버튼을 노출한다.
 * 디자인 토큰: --header-bg / --header-brand-text / --shadow-xs / space-4 패딩
 */
export default function Header() {
  const session = useSyncExternalStore(subscribeAuth, getSession, getServerSessionSnapshot);

  return (
    <header className="bg-(--header-bg) shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/products"
          className="-my-2 py-2 text-2xl font-bold tracking-tight text-(--header-brand-text)"
        >
          패캠 스토어
        </Link>

        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-(--color-text-secondary)">{session.email}</span>
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex min-h-11 items-center rounded-sm border border-(--color-border-default) bg-(--color-bg-primary) px-4 text-sm font-medium text-(--color-text-primary) transition-colors hover:bg-(--color-bg-surface)"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <nav className="flex items-center gap-2" aria-label="계정 메뉴">
            <Link
              href="/signup"
              className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
            >
              회원가입
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center rounded-sm bg-(--btn-primary-bg) px-4 text-sm font-semibold text-(--btn-primary-text) transition-colors hover:bg-(--btn-primary-bg-hover)"
            >
              로그인
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
