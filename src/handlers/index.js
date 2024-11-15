import { PACKET_TYPE } from "../constants/header.js";
import { register } from "./auth/register.handler.js";
const handlers = {
    [PACKET_TYPE.REGISTER_REQUEST]: {
        handler : register, // 사용하게될 함수명
        protoType : 'request.C2SRegisterRequest', // protobuf 타입
    },
    // [PACKET_TYPE.LOGIN_REQUEST]: {
    //     handler : register, // 사용하게될 함수명
    //     protoType : 'request.C2SLoginRequest', // protobuf 타입
    // },
    // [PACKET_TYPE.CREATE_ROOM_REQUEST]: {
    //     handler : register, // 사용하게될 함수명
    //     protoType : 'request.C2SCreateRoomRequest', // protobuf 타입
    // },
    // [PACKET_TYPE.GET_ROOM_LIST_REQUEST]: {
    //     handler : register, // 사용하게될 함수명
    //     protoType : 'request.C2SGetRoomListRequest', // protobuf 타입
    // },
    // [PACKET_TYPE.JOIN_ROOM_REQUEST]: {
    //     handler : register, // 사용하게될 함수명
    //     protoType : 'request.C2SJoinRandomRoomRequest', // protobuf 타입
    // },
    


}

export const getHandlerByPacketType = (packetType) => {
    if (!handlers[packetType]) {
        throw Error();
    }
    return handlers[packetType].handler;
}

export const getHandlerByHandlerId = (packetType) => {
    if (!handlers[packetType]) {
        throw Error();
    }
    return handlers[packetType].protoType;
}