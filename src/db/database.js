import mysql from 'mysql2/promise';
import { formatDate } from '../utils/dateFormatter.js';
import { config } from '../config/config.js';

// 데이터베이스 커넥션 풀 생성 함수
function createPool() {
  const pool = mysql.createPool({
    ...config.database.USER_DB,
    waitForConnections: true,
    connectionLimit: 10, // 커넥션 풀에서 최대 연결 수
    queueLimit: 0, // 0일 경우 무제한 대기열
  });

  const originalQuery = pool.query;

  //pool의 쿼리 실행 메서드를 재정의 (로그를 남기도록)
  pool.query = (sql, params) => {
    const date = new Date();
    // 쿼리 실행시 로그 (꼭 필요한가 의심됨.)
    console.log(
      `[${formatDate(date)}] Executing query: ${sql} ${
        params ? `, ${JSON.stringify(params)}` : ``
      }`,
    );
    return originalQuery.call(pool, sql, params); // 아직 call 사용법이 익숙치 않음.
  };

  return pool;
}

const dbPool = createPool();

export default dbPool;
