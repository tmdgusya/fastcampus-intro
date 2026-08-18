"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type SubmitEvent } from "react";

import { signIn } from "@/lib/auth";

/**
 * 로그인 페이지 (`/login`).
 * 가입된 계정(localStorage)으로 로그인하고, 성공 시 세션을 저장한 뒤 `/products`로 이동한다.
 * 실패 시 한글 안내를 노출한다. (localStorage 목업 — 이슈 #2)
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const joined = searchParams.get("joined") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = signIn(email, password);
    if (!result.ok) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    router.replace("/products");
  }

  return (
    <div className="min-h-full bg-(--color-bg-subtle)">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold leading-tight text-(--color-text-primary)">
          로그인
        </h1>

        {joined && (
          <p className="mt-4 rounded-md border border-(--color-border-default) bg-(--color-bg-primary) px-4 py-3 text-sm text-(--color-success)">
            가입이 완료되었습니다. 로그인해 주세요.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 rounded-md border border-(--color-border-default) bg-(--color-bg-primary) p-6 shadow-md"
        >
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-(--color-text-primary)"
            >
              이메일
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
              className="mt-2 w-full rounded-sm border border-(--color-border-default) bg-(--color-bg-primary) px-4 py-3 text-base text-(--color-text-primary) placeholder:text-(--color-text-tertiary) focus:border-(--color-border-brand)"
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-(--color-text-primary)"
            >
              비밀번호
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-sm border border-(--color-border-default) bg-(--color-bg-primary) px-4 py-3 text-base text-(--color-text-primary) placeholder:text-(--color-text-tertiary) focus:border-(--color-border-brand)"
            />
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-(--color-danger)">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-(--btn-primary-bg) px-4 text-sm font-semibold text-(--btn-primary-text) transition-colors hover:bg-(--btn-primary-bg-hover)"
          >
            로그인
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-(--color-text-secondary)">
          아직 계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-medium text-(--color-text-brand) transition-colors hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
