// 생성한 함수가 올바른 Return을 하는지 확인
// yarn run test 로 실행.
// git push 할 때는 내용을 지우고 원래상태로 돌린 뒤 push할 것.

/**
 * 사용 예시 : 테스트하고자 하는 함수 하나 적고 리턴을 확인
 * import { createRoomHandler } from '../handlers/room/room.create.handler';
 * console.log(createRoomHandler()); <- 이거 하나 적고 함수 테스트.
 */

import { createRoomHandler } from '../handlers/room/room.create.handler.js';
import { getProtoMessages, loadProtos } from '../init/loadProto.js';

await loadProtos(); // 코드 가장 위에 위치. proto 스키마를 읽어옴.
// 이 밑부터 작성
console.log(createRoomHandler());

console.log('testing...Done'); // 코드 가장 밑에 위치. 동작을 확인.
