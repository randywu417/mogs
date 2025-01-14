import { Chatting, Notify } from "../../../../types";
import { SERVER_EVENT_TYPE } from "../types";

export interface WebSocketMessage {
    readonly type: SERVER_EVENT_TYPE;
}

export class UpdateRoom implements WebSocketMessage {
    public readonly type = SERVER_EVENT_TYPE.UPDATE_ROOM;
}

export class UpdateOnlineStatus implements WebSocketMessage {
    public readonly type = SERVER_EVENT_TYPE.UPDATE_STATUS;
    public readonly onlineList;
    constructor(onlineList: Array<{ account: string; online: boolean }>) {
        this.onlineList = onlineList;
    }
}

export class ChattingMessage implements WebSocketMessage {
    public readonly type = SERVER_EVENT_TYPE.CHATTING;
    public readonly chatting;
    constructor(chatting: Chatting) {
        this.chatting = chatting;
    }
}

export class ExitedMessage implements WebSocketMessage {
    public readonly type = SERVER_EVENT_TYPE.EXIT;
    public readonly exited: string;
    constructor(exited: string) {
        this.exited = exited;
    }
}

export class SystemNotify implements WebSocketMessage {
    public readonly type = SERVER_EVENT_TYPE.NOTIFY;
    public readonly notify;
    constructor(notify: Notify) {
        this.notify = notify;
    }
}

export class JoinedAccount implements WebSocketMessage {
    public readonly type = SERVER_EVENT_TYPE.JOIN;
    public readonly account;
    constructor(account: string) {
        this.account = account;
    }
}
