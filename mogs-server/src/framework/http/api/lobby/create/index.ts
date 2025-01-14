import { Request, RequestHandler, Response } from "express";
import { roomDB } from "../../../../../db/room";
import { joinRoomDB, userDB } from "../../../../../db/user";
import { COLOR, RoomDetails, UserInfo } from "../../../../../types";
import { ERROR_CODE } from "../../../../../types/code";
import { ROOM_MAX_PEOPLE } from "../../../../../types/constant";
import LobbySocket from "../../../../websocket/lobby";

interface CreateRoomReq {
    host: UserInfo;
    name: string;
    numberOfPeople: number;
    color: COLOR;
}
const create: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { host, name, numberOfPeople, color }: CreateRoomReq = req.body;

    const randomRoomId = (): string => {
        let result = "";
        for (let i = 0; i < 10; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    };

    try {
        if (!userDB.has(host.account)) {
            res.status(401).send({ code: ERROR_CODE.AU00 });
            return;
        }
        if (
            !name ||
            !color ||
            numberOfPeople < 1 ||
            numberOfPeople > ROOM_MAX_PEOPLE ||
            joinRoomDB.get(host.account)
        ) {
            res.status(400).send({ code: ERROR_CODE.LC01 });
            return;
        }
        const roomId = randomRoomId();
        const room: RoomDetails = {
            id: roomId,
            name: name,
            host: host,
            users: [{ ...host, color }],
            maxPeople: numberOfPeople,
            createdTime: Date.now(),
        };
        roomDB.set(roomId, room);
        joinRoomDB.set(host.account, roomId);
        res.status(200).send({ roomId });
        LobbySocket.send_update_rooms_to_clients();
        return;
    } catch {
        res.status(500).send({ code: ERROR_CODE.UNKNOW });
        return;
    }
};

export default create;
