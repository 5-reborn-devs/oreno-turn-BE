
//명세
// [ PayloadOneofCase ] [ versionLength ] [ version ] [ sequence ] [ payloadLength ] [ payload ]
// 2 bytes              1 bytes         versionLength 4 bytes      4 bytes         payloadLength 
// C2S = 리틀 엔디안
// S2C = 빅 엔디안

import { getHandlerByPacketType } from "../handlers/index.js";
import { PACKET_TYPE_LENGTH,
         SEQUENCE_SIZE,
         PAYLOAD_LENGTH_SIZE
 } from "../constants/header.js";


export const onData = (socket) => async (data) => {
    // 패킷 해더 파싱
    socket.buffer = Buffer.concat([socket.buffer, data]);

    const headerSize = PACKET_TYPE_LENGTH + SEQUENCE_SIZE + PAYLOAD_LENGTH_SIZE;
    
    
    // 헤더 파싱 완료 뒤 패킷 타입 핸들링

};







