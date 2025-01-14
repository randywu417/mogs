import { Request, RequestHandler, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { roomDB } from "../../../../../db/room";
import { joinRoomDB } from "../../../../../db/user";
import { Notify } from "../../../../../types";
import { ERROR_CODE } from "../../../../../types/code";
import LobbySocket from "../../../../websocket/lobby";
import RoomSocket from "../../../../websocket/room";

const exit: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { roomId, user } = req.body;

    try {
        const room = roomDB.get(roomId);
        if (!room) {
            res.status(400).send({ code: ERROR_CODE.LJ01 });
            return;
        }
        if (room.users.length === 1) {
            roomDB.delete(roomId);
            joinRoomDB.delete(user.account);
            res.status(200).send({});
        } else {
            const index = room.users.findIndex(
                (u) => u.account === user.account
            );
            const isHost = room.host.account === user.account;
            room.users.splice(index, 1);
            if (isHost) {
                room.host = {
                    account: room.users[0].account,
                    nickname: room.users[0].nickname,
                };
            }
            joinRoomDB.delete(user.account);
            res.status(200).send({});
            const notify: Notify = {
                message: `${user.nickname} is exited.`,
                messageId: uuidv4(),
                time: Date.now(),
            };
            RoomSocket.send_system_msg_to_clients(roomId, notify);
            RoomSocket.send_update_room_to_clients(roomId);
            RoomSocket.send_online_status_to_clients(roomId);
            RoomSocket.send_exit_user_to_clients(roomId, user.account);
        }
        LobbySocket.send_update_rooms_to_clients();
        return;
    } catch {
        res.status(500).send({ code: ERROR_CODE.UNKNOW });
        return;
    }
};

export default exit;
