import Room from '../classes/models/room.class.js';
import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

export const onConnection = (socket) => {
  console.log(`클라이언트 연결: ${socket.remoteAddress}`);
  socket.buffer = Buffer.alloc(0); // 버퍼 만들어 두기.
  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));

  // const room = new Room(
  //   1,1,'같이할사람',7,2,[]
  // );

  // //여기서부터 강제 방 생성 테스트임
  // const currentTime = Date.now();
  // const nextPhaseAt = currentTime + 18000; //페이즈 초기값
  // console.log(room.name);
  // room.button(nextPhaseAt);

};
