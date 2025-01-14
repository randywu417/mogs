import { Request, RequestHandler, Response } from "express";
import { roomDB } from "../../../../../db/room";
import { ERROR_CODE } from "../../../../../types/code";

const search: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    let { roomId } = req.query;
    if (typeof roomId !== "string") {
        roomId = "";
    }
    try {
        if (!roomId || !roomDB.has(roomId)) {
            res.status(400).send({ code: ERROR_CODE.LS01 });
            return;
        }
        res.status(200).send({ exist: true });
        return;
    } catch {
        res.status(500).send({ code: ERROR_CODE.UNKNOW });
        return;
    }
};

export default search;
