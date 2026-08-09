import { rmSync } from "node:fs";
import { execSync } from "node:child_process";

/**
 * 모든 테스트 전에 1회 실행되어 테스트 DB를 처음부터 만든다.
 * 개발 DB(dev.db)와 분리된 test.db를 force-reset 후 seed 해,
 * 테스트가 항상 동일한 6개 상품 데이터로 시작하게 한다.
 */
export default function setup(): void {
  const env = { ...process.env, DATABASE_URL: "file:./test.db" };

  // 테스트마다 깨끗한 DB에서 시작하도록 파일을 삭제한다.
  for (const file of ["test.db", "test.db-journal"]) {
    rmSync(file, { force: true });
  }

  // 마이그레이션을 적용해 스키마를 만든 뒤 seed 한다. (파괴적 reset 없음)
  execSync("pnpm exec prisma migrate deploy", { env, stdio: "inherit" });
  execSync("pnpm exec prisma db seed", { env, stdio: "inherit" });
}