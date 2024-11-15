import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetName.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const protoDir = path.join(__dirname,'../protobuf');

const getAllProtoFiles = (dir, fileList = []) => {

    const files = fs.readdirSync(dir);
    files.forEach((file)=>{
        const filePath = path.join(dir,file);
        if(fs.statSync(filePath).isDirectory()){
            getAllProtoFiles(filePath,fileList);
        } else if (path.extname(file)==='.proto'){
            fileList.push(filePath);
        } 
    });
    return fileList;
}

const protoFiles = getAllProtoFiles(protoDir);
const protoMessages = {};

export const loadProtos = async() =>{
    try{

        const root = new protobuf.Root();

        await Promise.all(protoFiles.map((file)=>root.load(file)));
        
        // packetNames에 미리 정리한 패킷들을 가져와 매핑
        for(const [namespace, types] of Object.entries(packetNames)){
            protoMessages[namespace] = {};
            for(const [type,typeName] of Object.entries(types)){
                protoMessages[namespace][type] = root.lookup(typeName);
            }
            //root.lookupEnum


        

        }

        console.log('protobuf 파일 로드 완료.');

    } catch(e) {
        console.error(`protobuf 파일 로드 중 오류가 발생했습니다. ${e}`)
    } 
}

export const getProtoMessages = () => {
    return {...protoMessages}; 
}
