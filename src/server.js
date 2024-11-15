import net from 'net';
import { onConnection } from './events/onConnection.js';
import initServer from './init/index.js';

const HOST = '127.0.0.1'
const PORT = 3000;

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(PORT, HOST, () => {
      console.log(`Sever is on ${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
