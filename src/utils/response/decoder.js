import { PACKET_NUMBER } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import camelCase from 'lodash/camelCase.js';

export const decoder = (packetType, payloadData) => {
    try {
        const protoMessages = getProtoMessages();
        
        console.log("typeName", payloadData);
      const typeName = PACKET_NUMBER[packetType]; // 요기

      console.log("pakcetName", payloadData);
      const packetName = 'C2S' + camelCase('tmp_' + typeName).slice(3);

      console.log("packetName", packetName);
      if(typeof packetName === 'string'){
        console.log("string임!");
      }
      console.log(protoMessages);
      console.log(protoMessages.request);
      console.log('얘가 나올까?', protoMessages.request[packetName]);

      const request = protoMessages.request;
      const request2 = request[packetName];
      
    console.log("payload", payloadData);  
      return request2.decode(payloadData);
    } catch (error) {
      console.error(error);
    }
  }