"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";

import {
  PASSWORD_MIN_LENGTH,
  isEmailValid,
  isPasswordValid,
  registerAccount,
} from "@/lib/auth";

/**
 * 회원가입 페이지 (`/signup`).
 * 이메일·비밀번호 형식과 중복(이메일)을 검증하고, 성공 시 localStorage에 계정을 저장한 뒤
 * 로그인 페이지(`/login?joined=1`)로 이동한다. (localStorage 목업 — 이슈 #2)
 */
export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isEmailValid(email)) {
      setError("올바른 이메일 형식을 입력해 주세요.");
      return;
    }
    if (!isPasswordValid(password)) {
      setError(`비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`);
      return;
    }

    const result = registerAccount(email, password);
    if (!result.ok) {
      setError("이미 가입된 이메일입니다.");
      return;
    }

    router.replace("/login?joined=1");
  }

  return (
    <div className="min-h-full bg-(--color-bg-subtle)">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold leading-tight text-(--color-text-primary)">
          회원가입
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 rounded-md border border-(--color-border-default) bg-(--color-bg-primary) p-6 shadow-md"
        >
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-(--color-text-primary)"
            >
              이메일
            </label>
            <input
              id="signup-email"
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
              htmlFor="signup-password"
              className="block text-sm font-medium text-(--color-text-primary)"
            >
              비밀번호
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={`${PASSWORD_MIN_LENGTH}자 이상`}
              className="mt-2 w-full rounded-sm border border-(--color-border-default) bg-(--color-bg-primary) px-4 py-3 text-base text-(--color-text-primary) placeholder:text-(--color-text-tertiary) focus:border-(--color-border-brand)"
            />
            <p className="mt-2 text-2xs text-(--color-text-secondary)">
              비밀번호는 {PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.
            </p>
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
            가입하기
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-(--color-text-secondary)">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-medium text-(--color-text-brand) transition-colors hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
