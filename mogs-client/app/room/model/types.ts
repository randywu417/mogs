import { UserInfo } from "@/app/types";
import { ACTION } from "../components/Scene/types";

export enum SOCKET_EVENT {
    UPDATE_ROOM = "update-room",
    UPDATE_STATUS = "update-online-status",
    CHATTING = "chatting",
    NOTIFY = "notify",
    // web rtc
    JOIN = "join",
    OFFER = "offer",
    ANSWER = "answer",
    CANDIDATE = "candidate",
    EXIT = "exit",
}

export type OnlineList = Array<{ account: string; online: boolean }>;
export interface ChangeItem {
    action: "join" | "exit";
    account: string;
}

export interface Chatting {
    user: UserInfo;
    message: string;
    messageId: string;
    time: number;
}

export interface Notify {
    message: string;
    messageId: string;
    time: number;
}

export interface ChattingReq {
    roomId: string;
    chatting: Chatting;
}

export interface ExitRoomReq {
    user: UserInfo;
    roomId: string;
}

export interface ChangePeopleReq {
    roomId: string;
    newPeople: number;
}

export interface GameState {
    action: ACTION;
    position: { x: number; y: number; z: number };
    quaternion: { x: number; y: number; z: number; w: number };
    timestamp: number;
}
