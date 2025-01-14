import { Request, RequestHandler, Response } from "express";
import { roomDB } from "../../../../../db/room";
import { RoomDetails } from "../../../../../types";
import { ERROR_CODE } from "../../../../../types/code";
import LobbySocket from "../../../../websocket/lobby";
import RoomSocket from "../../../../websocket/room";

const changePeople: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { roomId, newPeople } = req.body;

    try {
        const room = roomDB.get(roomId);
        if (!room) {
            res.status(400).send({ code: ERROR_CODE.LJ01 });
            return;
        }
        if (newPeople < room.users.length) {
            res.status(400).send({ code: ERROR_CODE.RC01 });
            return;
        }
        const newRoomInfo: RoomDetails = {
            id: room.id,
            name: room.name,
            host: room.host,
            users: room.users,
            maxPeople: room.maxPeople,
            createdTime: room.createdTime,
        };
        roomDB.set(roomId, { ...room, maxPeople: newPeople });

        res.status(200).send({});
        RoomSocket.send_update_room_to_clients(roomId);
        LobbySocket.send_update_rooms_to_clients();
        return;
    } catch {
        res.status(500).send({ code: ERROR_CODE.UNKNOW });
        return;
    }
};

export default changePeople;
