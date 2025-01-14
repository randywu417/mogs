import { COLOR, ROOM_STATE, UserInfo } from "@/app/types";

export enum SOCKET_EVENT {
    UPDATE_ROOMS = "update-rooms",
}

export interface CreateRoomForm {
    host: UserInfo;
    name: string;
    numberOfPeople: number;
    color: COLOR;
}

export interface JoinRoomInfo {
    roomId: string;
    user: UserInfo;
    color: COLOR;
}

export interface Room {
    id: string;
    name: string;
    host: string;
    numberOfPeople: number;
    state: ROOM_STATE;
    createdTime: string;
}

export interface UserInRoom extends UserInfo {
    color: COLOR;
}

export interface RoomDetails {
    id: string;
    name: string;
    host: UserInfo;
    users: Array<UserInRoom>;
    maxPeople: number;
}

export interface CreateRoomRes {
    roomId: string;
}

export interface SearchRoomRes {
    exist: boolean;
}
