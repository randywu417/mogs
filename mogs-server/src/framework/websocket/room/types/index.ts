export enum SERVER_EVENT_TYPE {
    UPDATE_ROOM = "update-room",
    UPDATE_STATUS = "update-online-status",
    CHATTING = "chatting",
    NOTIFY = "notify",
    EXIT = "exit",
    JOIN = "join",
    OFFER = "offer",
    ANSWER = "answer",
    CANDIDATE = "candidate",
}

export enum CLIENT_EVENT_TYPE {
    JOIN = "join",
    OFFER = "offer",
    ANSWER = "answer",
    CANDIDATE = "candidate",
}
