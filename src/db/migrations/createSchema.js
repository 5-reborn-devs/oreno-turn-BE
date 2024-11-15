import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dbPool from '../database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQL문자열을 쿼리 단위로 나눔
function parseQueries(sql) {
  return sql
    .split(';')
    .map((query) => query.trim())
    .filter((query) => query.length > 0);
}

const createSchemas = async () => {
  const sqlDir = path.join(__dirname, '../sql');
  try {
    console.log(sqlDir + '/user_db.sql', 'utf8');
    const sql = fs.readFileSync(sqlDir + '/user_db.sql', 'utf8');
    const queries = parseQueries(sql);

    // 파싱한 쿼리를 실행
    for (const query of queries) {
      await dbPool.query(query);
    }

    console.log('데이터베이스 테이블 생성 성공');
  } catch (error) {
    console.error('데이터베이스 테이블 생성 에러: ', error);
  }
};

createSchemas()
  .then(() => {
    console.log('마이그레이션 완료');
    process.exit(0); // 마이그레이션 완료 후 프로세스 종료
  })
  .catch((error) => {
    console.error('마이그레이션 실행 오류: ', error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });

/**
 * mysql에서 스키마 조회
 * DESC [TABLE_NAME];
 *
 * 테이블 삭제
 * DROP TABLE table_name;
 */
