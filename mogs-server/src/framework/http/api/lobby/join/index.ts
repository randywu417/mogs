import { Request, RequestHandler, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { roomDB } from "../../../../../db/room";
import { joinRoomDB } from "../../../../../db/user";
import { COLOR, Notify, UserInfo } from "../../../../../types";
import { ERROR_CODE } from "../../../../../types/code";
import { ROOM_MAX_PEOPLE } from "../../../../../types/constant";
import LobbySocket from "../../../../websocket/lobby";
import RoomSocket from "../../../../websocket/room";

interface JoinRoomReq {
    roomId: string;
    user: UserInfo;
    color: COLOR;
}
const join: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { roomId, user, color }: JoinRoomReq = req.body;

    try {
        const room = roomDB.get(roomId);
        if (!room) {
            res.status(400).send({ code: ERROR_CODE.LJ01 });
            return;
        } else if (
            room.users.length >= room.maxPeople ||
            room.users.length >= ROOM_MAX_PEOPLE
        ) {
            res.status(400).send({ code: ERROR_CODE.LJ01 });
            return;
        }
        const isJoin = room.users.find((u) => u.account === user.account);
        if (!Boolean(isJoin)) {
            room.users.push({ ...user, color });
        }
        joinRoomDB.set(user.account, roomId);
        res.status(200).send({});
        const notify: Notify = {
            message: `${user.nickname} is joined.`,
            messageId: uuidv4(),
            time: Date.now(),
        };
        RoomSocket.send_system_msg_to_clients(roomId, notify);
        LobbySocket.send_update_rooms_to_clients();
        return;
    } catch {
        res.status(500).send({ code: ERROR_CODE.UNKNOW });
        return;
    }
};

export default join;
