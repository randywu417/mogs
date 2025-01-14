import { Request, RequestHandler, Response } from "express";
import { roomDB } from "../../../../../db/room";
import { Chatting } from "../../../../../types";
import { ERROR_CODE } from "../../../../../types/code";
import RoomSocket from "../../../../websocket/room";

const chatting: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {
        roomId,
        chatting: { user, message, messageId, time },
    } = req.body;

    try {
        const room = roomDB.get(roomId);
        if (!room) {
            res.status(400).send({ code: ERROR_CODE.LJ01 });
            return;
        }
        if (!message.trim() || !messageId || !user || !time) {
            res.status(400).send({ code: ERROR_CODE.RM01 });
            return;
        }
        const chatting: Chatting = {
            user,
            message,
            messageId,
            time,
        };
        res.status(200).send({});
        RoomSocket.send_chatting_msg_to_clients(roomId, chatting);
        return;
    } catch {
        res.status(500).send({ code: ERROR_CODE.UNKNOW });
        return;
    }
};

export default chatting;
