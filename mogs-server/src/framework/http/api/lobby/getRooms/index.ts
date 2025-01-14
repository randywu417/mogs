import { Request, RequestHandler, Response } from "express";
import { roomDB } from "../../../../../db/room";
import { Room, ROOM_STATE } from "../../../../../types";
import { ERROR_CODE } from "../../../../../types/code";

const getRooms: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const rooms: Array<Room> = [];
        for (const [, value] of roomDB) {
            rooms.push({
                id: value.id,
                name: value.name,
                host: value.host.nickname,
                numberOfPeople: value.users.length,
                state: (() => {
                    if (value.users.length < value.maxPeople) {
                        return ROOM_STATE.OPEN;
                    } else {
                        return ROOM_STATE.FULL;
                    }
                })(),
                createdTime: new Date(value.createdTime).toLocaleDateString(),
            });
        }
        res.status(200).send({ rooms });
        return;
    } catch {
        res.status(500).send({ code: ERROR_CODE.UNKNOW });
        return;
    }
};

export default getRooms;
