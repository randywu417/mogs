import { Request, RequestHandler, Response } from "express";
import * as jose from "jose";
import { userDB } from "../../../../../db/user";
import { ERROR_CODE } from "../../../../../types/code";
import { validateAccount, validatePassword, verifyPassword } from "../utils";

const SECRET_KEY = new TextEncoder().encode("test-key");

interface SignInReq {
    account: string;
    password: string;
}
const signin: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { account, password }: SignInReq = req.body;

    try {
        if (!account || !password) {
            res.status(400).send({ code: ERROR_CODE.AU01 });
            return;
        }

        if (
            validateAccount(account) !== true ||
            validatePassword(password) !== true
        ) {
            res.status(400).send({ code: ERROR_CODE.AU02 });
            return;
        }

        const acc = userDB.get(account);
        if (!acc) {
            res.status(400).send({ code: ERROR_CODE.AU04 });
            return;
        }
        const isMatch = await verifyPassword(password, acc.password);
        if (!isMatch) {
            res.status(400).send({ code: ERROR_CODE.AU05 });
            return;
        }

        const tk = await new jose.SignJWT({
            nickname: acc.nickname,
            account: acc.account,
        })
            .setProtectedHeader({ alg: "HS256" })
            .sign(SECRET_KEY);

        res.status(200).send({ tk: tk });
        return;
    } catch (err) {
        console.warn(err);
        res.status(500).send({ code: ERROR_CODE.UNKNOW });
        return;
    }
};

export default signin;
