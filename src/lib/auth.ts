/**
 * localStorage 기반 인증 목업 — 인증 상태의 단일 진실 공급원(SSOT).
 * 실제 백엔드·DB·API·세션·토큰 대신 브라우저 localStorage에 계정과 세션을 저장한다.
 * (이슈 #2: 소유자가 "localStorage 기반 목업"으로 범위 확장을 승인함)
 *
 * ⚠️ 모든 함수는 클라이언트에서만 호출한다. (SSR 동안에는 localStorage 접근 금지)
 * 비밀번호는 목업 한정으로 평문 저장한다. (암호화·해싱은 범위 외)
 */

/** 가입 계정. localStorage에 배열로 저장된다. */
export interface AuthAccount {
  /** 로그인 이메일 */
  email: string;
  /** 비밀번호 (목업 한정 평문) */
  password: string;
}

/** 로그인 세션. 이메일로 사용자를 식별한다. */
export interface AuthSession {
  email: string;
}

/** 이메일 형식 검증용 정규식 (간단한 목업용) */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 비밀번호 최소 길이 (가입 검증·안내 문구에 사용) */
export const PASSWORD_MIN_LENGTH = 8;

const ACCOUNTS_KEY = "pacam-store-accounts";
const SESSION_KEY = "pacam-store-session";

/** auth 상태 변화를 구독하는 리스너 (Header 등 UI 동기화용) */
type AuthListener = () => void;
const listeners = new Set<AuthListener>();

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** auth 상태 변화를 구독한다. 반환된 함수로 구독을 해제한다. */
export function subscribeAuth(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * localStorage 세션 캐시. 값이 바뀌지 않는 한 같은 참조를 반환해
 * `useSyncExternalStore`가 불필요한 재렌더를 만들지 않게 한다.
 */
let cachedSessionRaw: string | null = null;
let cachedSession: AuthSession | null = null;

/** 알 수 없는 값이 AuthAccount 모양인지 판별한다. (localStorage 손상 데이터 방어) */
function isAuthAccount(value: unknown): value is AuthAccount {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as AuthAccount).email === "string" &&
    typeof (value as AuthAccount).password === "string"
  );
}

function readAccounts(): AuthAccount[] {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter(isAuthAccount);
    }
  } catch {
    // 손상된 데이터는 무시한다.
  }
  return [];
}

function writeAccounts(accounts: AuthAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

/** 이메일 형식이 올바른지 검증한다. */
export function isEmailValid(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/** 비밀번호가 최소 길이 요건을 충족하는지 검증한다. */
export function isPasswordValid(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH;
}

/** 이미 가입된 이메일인지 확인한다. */
export function isEmailRegistered(email: string): boolean {
  const trimmed = email.trim();
  return readAccounts().some((account) => account.email === trimmed);
}

/** 회원가입 결과. 성공 시 localStorage에 계정을 저장한다. */
export type RegisterResult = { ok: true } | { ok: false; reason: "duplicate" };

/** 회원가입. 같은 이메일이 이미 있으면 실패한다. */
export function registerAccount(email: string, password: string): RegisterResult {
  const trimmed = email.trim();
  const accounts = readAccounts();
  if (accounts.some((account) => account.email === trimmed)) {
    return { ok: false, reason: "duplicate" };
  }
  accounts.push({ email: trimmed, password });
  writeAccounts(accounts);
  return { ok: true };
}

/** 로그인 결과. 성공 시 localStorage에 세션을 저장하고 auth 상태 변화를 알린다. */
export type SignInResult = { ok: true } | { ok: false; reason: "invalid-credentials" };

/** 로그인. 등록된 계정과 일치하면 세션을 저장한다. */
export function signIn(email: string, password: string): SignInResult {
  const trimmed = email.trim();
  const account = readAccounts().find(
    (candidate) => candidate.email === trimmed && candidate.password === password,
  );
  if (!account) {
    return { ok: false, reason: "invalid-credentials" };
  }
  const session: AuthSession = { email: account.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notify();
  return { ok: true };
}

/** 현재 로그인 세션을 반환한다. 없으면 `null`. (값이 같으면 동일 참조를 재사용) */
export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (raw === cachedSessionRaw) {
    return cachedSession;
  }
  cachedSessionRaw = raw;

  if (!raw) {
    cachedSession = null;
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as AuthSession).email === "string"
    ) {
      cachedSession = { email: (parsed as AuthSession).email };
    } else {
      cachedSession = null;
    }
  } catch {
    // 손상된 세션은 무시한다.
    cachedSession = null;
  }
  return cachedSession;
}

/** 로그아웃. 세션을 제거하고 auth 상태 변화를 알린다. */
export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
  notify();
}
