import { RoomDetails } from "@/app/lobby/model/types";
import * as fetch from "@/app/utils/fetch";
import FetchResponse from "@/app/utils/fetchResponse";
import { convertToSearchParams } from "@/app/utils/searchParams";
import { ChangePeopleReq, ChattingReq, ExitRoomReq } from "../model/types";

export const fetchGetRoom = async (
    account: string,
    roomId: string
): Promise<FetchResponse<RoomDetails>> => {
    const params = convertToSearchParams({ account, roomId });
    return new Promise((resolve, reject) => {
        fetch
            .get(`/api/room/info${params}`)
            .then((response) => {
                resolve(new FetchResponse<RoomDetails>(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};

export const fetchExitRoom = async (req: ExitRoomReq) => {
    return new Promise((resolve, reject) => {
        fetch
            .post(`/api/room/exit`, req)
            .then((response) => {
                resolve(new FetchResponse(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};

export const fetchChangePeople = async (req: ChangePeopleReq) => {
    return new Promise((resolve, reject) => {
        fetch
            .post(`/api/room/changePeople`, req)
            .then((response) => {
                resolve(new FetchResponse(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};

export const fetchChattingMsg = async (req: ChattingReq) => {
    return new Promise((resolve, reject) => {
        fetch
            .post(`/api/room/chatting`, req)
            .then((response) => {
                resolve(new FetchResponse(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};
