export const TOTAL_LENGTH = 11; 
export const PACKET_TYPE_LENGTH = 2; 
export const VERSION_START = 3; // 클라에서 보내주는 버퍼 3byte까지를 의미함
export const SEQUENCE_SIZE = 4;
export const PAYLOAD_LENGTH_SIZE = 4;

export const PACKET_TYPE = { // 클라이언트나 서버가 데이터 전송 할 때 파악한 패킷 타입 (핸들러 ID)
    // 회원가입 및 로그인 
    REGISTER_REQUEST : 1, 
    REGISTER_RESPONSE : 2,
    LOGIN_REQUEST : 3,
    LOGIN_RESPONSE : 4,

    // 방 생성
    CREATE_ROOM_REQUEST : 5,
    CREATE_ROOM_RESPONSE : 6,

    // 방 목록 불러오기
    GET_ROOM_LIST_REQUEST : 7,
    GET_ROOM_LIST_RESPONSE : 8,

    // 방 참여
    JOIN_ROOM_REQUEST : 9,
    JOIN_ROOM_RESPONSE : 10,

    // 방 랜덤 참여
    JOIN_RANDOM_ROOM_REQUEST : 11,
    JOIN_RANDOM_ROOM_RESPONSE : 12,
    JOIN_ROOM_NOTIFICATION : 13,

    // 방 이탈 
    LEAVE_ROOM_REQUEST : 14,
    LEAVE_ROOM_RESPONSE : 15,
    LEAVE_ROOM_NOTIFICATION : 16,

    // 게임 준비
    GAME_PREPARE_REQUEST : 17,
    GAME_PREPARE_RESPONSE : 18,
    GAME_PREPARE_NOTIFICATION : 19,

    // 게임 시작 
    GAME_START_REQUEST : 20,
    GAME_START_RESPONSE : 21,
    GAME_START_NOTIFICATION : 22,

    // 위치 동기화 
    POSITION_UPDATE_REQUEST : 23,
    POSITION_UPDATE_NOTIFICATION : 24,

    // 카드 사용
    USE_CARD_REQUEST : 25, 
    USE_CARD_RESPONSE : 26,
    USE_CARD_NOTIFICATION : 27,

    // 카드 장착
    EQUIP_CARD_NOTIFICATION : 28,
    CARD_EFFECT_NOTIFICATION : 29,

    // 플리마켓
    FLEAMARKET_NOTIFICATION : 30,
    FLEAMARKET_PICK_REQUEST : 31,
    FLEAMARKET_PICK_RESPONSE : 32,

    // 카드 사용, 체력 감소 등 유저 상태 변경 시
    USER_UPDATE_NOTIFICATION : 33,

    // 페이즈 업데이트
    PHASE_UPDATE_NOTIFICATION : 34,

    // 상대에게 피격 시 - 대응 카드 보유 시 팝업 발생
    REACTION_REQUEST : 35,
    REACTION_RESPONSE : 36,

    // 카드 사용 후 소멸
    DESTROY_CARD_REQUEST : 37,
    DESTROY_CARD_RESPONSE : 38,

    // 게임 종료
    GAME_END_NOTIFICATION : 39,

    // 카드 선택 
    CARD_SELECT_REQUEST : 40,
    CARD_SELECT_RESPONSE : 41,

    // 폭탄 넘기기
    PASS_DEBUFF_REQUEST : 42,
    PASS_DEBUFF_RESPONSE : 43,

    // 폭탄 폭발 경고
    WARNING_NOTIFICAITON : 44,
    ANIMATION_NOTIFICATION : 45
}

export const PACKET_NUMBER = { // 이게 필요할까에 대한 고민 필요한가
    //서버에서 사용하게될 패킷 번호 할당 할 곳
    1: 'REGISTER_REQUEST', 
}