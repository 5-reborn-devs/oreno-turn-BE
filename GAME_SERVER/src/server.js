import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';

const createServerForPort = (port) => {
  const server = net.createServer(onConnection);

  initServer()
    .then(() => {
      server.listen(port, config.server.host2, () => {
        console.log(`Server running on ${config.server.host2}:${port}`);
        console.log(server.address());
      });
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
};

// 여러 포트에서 서버를 실행
const ports = [6667, 6668, 6669]; // 사용할 포트 배열

ports.forEach((port) => createServerForPort(port));
