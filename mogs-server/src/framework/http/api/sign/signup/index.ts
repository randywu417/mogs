import { Request, RequestHandler, Response } from "express";
import { userDB } from "../../../../../db/user";
import { ERROR_CODE } from "../../../../../types/code";
import {
    hashPassword,
    validateAccount,
    validateNickname,
    validatePassword,
} from "../utils";

interface SignUpReq {
    nickname: string;
    account: string;
    password: string;
    confirmPassword: string;
}
const signup: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { nickname, account, password, confirmPassword }: SignUpReq =
        req.body;

    try {
        if (!nickname || !account || !password || !confirmPassword) {
            res.status(400).send({ code: ERROR_CODE.AU01 });
            return;
        }
        if (
            validateNickname(nickname) !== true ||
            validateAccount(account) !== true ||
            validatePassword(password) !== true ||
            validatePassword(confirmPassword) !== true ||
            password !== confirmPassword
        ) {
            res.status(400).send({ code: ERROR_CODE.AU02 });
            return;
        }
        const hashedPassword = await hashPassword(password);

        if (userDB.has(account)) {
            res.status(400).send({ code: ERROR_CODE.AU03 });
            return;
        }

        userDB.set(account, { nickname, account, password: hashedPassword });
        res.status(200).send({});
        return;
    } catch {
        res.status(500).send({ code: ERROR_CODE.UNKNOW });
        return;
    }
};

export default signup;
