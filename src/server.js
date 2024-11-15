import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.host, config.server.port, () => {
      console.log(`Sever running is on ${config.server.host}:${config.server.port}`);
      console.log(server.address())
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
