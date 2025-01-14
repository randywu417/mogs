import * as fetch from "@/app/utils/fetch";
import FetchResponse from "@/app/utils/fetchResponse";
import {
    CreateRoomForm,
    CreateRoomRes,
    JoinRoomInfo,
    Room,
    RoomDetails,
    SearchRoomRes,
} from "../model/types";

export const fetchCheckRoom = async (
    account: string
): Promise<FetchResponse<{ roomId: string }>> => {
    return new Promise((resolve, reject) => {
        fetch
            .post(`/api/lobby/checkRoom`, { account })
            .then((response) => {
                resolve(new FetchResponse<{ roomId: string }>(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};

export const fetchCreateRoom = async (
    req: CreateRoomForm
): Promise<FetchResponse<CreateRoomRes>> => {
    return new Promise((resolve, reject) => {
        fetch
            .post(`/api/lobby/create`, req)
            .then((response) => {
                resolve(new FetchResponse<CreateRoomRes>(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};

export const fetchJoinRoom = async (req: JoinRoomInfo) => {
    return new Promise((resolve, reject) => {
        fetch
            .post(`/api/lobby/join`, req)
            .then((response) => {
                resolve(new FetchResponse(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};

export const fetchSearchRoomById = async (
    id: string
): Promise<FetchResponse<SearchRoomRes>> => {
    return new Promise((resolve, reject) => {
        fetch
            .get(`/api/lobby/search?roomId=${id}`)
            .then((response) => {
                resolve(new FetchResponse<SearchRoomRes>(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};

export const fetchGetRooms = async (): Promise<
    FetchResponse<{ rooms: Array<Room> }>
> => {
    return new Promise((resolve, reject) => {
        fetch
            .get(`/api/lobby/getRooms`)
            .then((response) => {
                resolve(new FetchResponse<{ rooms: Array<Room> }>(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};

export const fetchRoomDetails = async (
    id: string
): Promise<FetchResponse<RoomDetails>> => {
    return new Promise((resolve, reject) => {
        fetch
            .get(`/api/lobby/roomDetails?roomId=${id}`)
            .then((response) => {
                resolve(new FetchResponse<RoomDetails>(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};
