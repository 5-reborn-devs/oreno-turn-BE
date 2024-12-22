import Queue from '../classes/models/queue.class.js';
import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

export const onConnection = (socket) => {
  console.log(`클라이언트 연결: ${socket.remoteAddress}`);
  socket.buffer = Buffer.alloc(0); // 버퍼 만들어 두기.
  socket.queue = new Queue(2000); // taskQueue

  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
