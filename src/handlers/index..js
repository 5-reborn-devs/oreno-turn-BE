
const handlers = {
    [PACKET_TYPE]
}


export const getHandlerByPacketType = (packetType) => {
    if (!handlers[packetType]) {
        throw Error();
    }
    
}