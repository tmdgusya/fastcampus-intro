// 테스트 워커에서는 개발 DB(dev.db)를 건드리지 않도록
// 별도 테스트 DB(test.db)를 가리킨다. dotenv는 이미 설정된 값을 덮어쓰지 않으므로
// src/lib/prisma.ts가 이 값을 그대로 사용한다.
process.env.DATABASE_URL = "file:./test.db";