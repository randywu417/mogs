import { SERVER_EVENT_TYPE } from "../types";

export interface WebSocketMessage {
    readonly type: SERVER_EVENT_TYPE;
}

export class UpdateRooms implements WebSocketMessage {
    public readonly type = SERVER_EVENT_TYPE.UPDATE_ROOMS;
}
