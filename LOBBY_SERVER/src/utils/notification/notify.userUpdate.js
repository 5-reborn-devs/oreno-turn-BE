import { PACKET_TYPE } from "../../constants/header.js";
import { getUsersInRoom, getUsersWithoutMe } from "../../session/room.session.js";
import { clients } from "../../session/session.js";
import sendResponsePacket from "../response/createResponse.js";
import { parseMyData } from "./myUserData.js";
import { parseUserDatas } from "./userDatas.js";

export const userUpdateNotifyForEachUser = (user) => {
    const userSocket = clients.get(user.id)
    const roomId = userSocket.roomId;
    const allUsersInRoom = getUsersInRoom(roomId);

    allUsersInRoom.forEach((userInRoom) => {
      const otherUsers = getUsersWithoutMe(roomId, userInRoom.id);
      const socketById = clients.get(userInRoom.id);
      const userDatas = [parseMyData(userInRoom), ...parseUserDatas(otherUsers)];
      
      sendResponsePacket(socketById, PACKET_TYPE.USER_UPDATE_NOTIFICATION, {
        userUpdateNotification: {
          user: userDatas,
        },
      });
    });

}