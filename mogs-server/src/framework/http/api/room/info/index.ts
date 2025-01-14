import { Request, RequestHandler, Response } from "express";
import { roomDB } from "../../../../../db/room";
import { ERROR_CODE } from "../../../../../types/code";

const info: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    let { account, roomId } = req.query;
    if (typeof roomId !== "string") {
        roomId = "";
    }
    try {
        const room = roomDB.get(roomId);
        if (!room) {
            res.status(400).send({ code: ERROR_CODE.LJ01 });
            return;
        }
        if (!room.users.find((u) => u.account === account)) {
            res.status(400).send({ code: ERROR_CODE.RI01 });
            return;
        }
        res.status(200).send(room);
        return;
    } catch {
        res.status(500).send({ code: ERROR_CODE.UNKNOW });
        return;
    }
};

export default info;
