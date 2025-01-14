import { Express } from "express";

export interface InitServer {
    initial: (app: Express) => void;
}

export interface Room {
    id: string;
    name: string;
    host: string;
    numberOfPeople: number;
    state: ROOM_STATE;
    createdTime: string;
}

export interface RoomDetails {
    id: string;
    name: string;
    host: UserInfo;
    users: Array<UserInRoom>;
    maxPeople: number;
    createdTime: number;
}

export interface UserInfo {
    nickname: string;
    account: string;
}

interface UserInRoom extends UserInfo {
    color: COLOR;
}

export enum ROOM_STATE {
    OPEN = "OPEN",
    FULL = "FULL",
    LOCK = "LOCKED",
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

export enum COLOR {
    RED = 1,
    ORANGE,
    CORAL,
    GOLD,
    YELLOW,
    AMBER,
    LIME,
    GREEN,
    EMERALD,
    OLIVE,
    TEAL,
    CYAN,
    SKY,
    BLUE,
    INDIGO,
    NAVY,
    PURPLE,
    VIOLET,
    MAGENTA,
    PINK,
    CRIMSON,
    MAROON,
    BROWN,
    SILVER,
}
