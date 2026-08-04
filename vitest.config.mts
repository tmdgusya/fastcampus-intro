import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // tsconfig의 "@/*" → "src/*" 경로 별칭을 테스트에서도 동일하게 적용한다.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
