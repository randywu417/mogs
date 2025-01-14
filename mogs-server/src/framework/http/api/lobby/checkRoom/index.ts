import { Request, RequestHandler, Response } from "express";
import { joinRoomDB, userDB } from "../../../../../db/user";
import { ERROR_CODE } from "../../../../../types/code";

const checkRoom: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { account } = req.body;

    try {
        if (!userDB.has(account)) {
            res.status(401).send({ code: ERROR_CODE.AU00 });
            return;
        }
        const roomId = joinRoomDB.get(account);
        if (!roomId) {
            res.status(200).send({ roomId: "" });
            return;
        } else {
            res.status(200).send({ roomId: roomId });
            return;
        }
    } catch {
        res.status(500).send({ code: ERROR_CODE.UNKNOW });
        return;
    }
};

export default checkRoom;
