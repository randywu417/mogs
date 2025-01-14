import { Request, RequestHandler, Response } from "express";
import { jwtVerify } from "jose";
import { ERROR_CODE } from "../../../types/code";

const SECRET_KEY = new TextEncoder().encode("test-key");

const middleware: RequestHandler = async (
    req: Request,
    res: Response,
    next
): Promise<void> => {
    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        // return NextResponse.redirect(new URL("/", request.url));
        res.status(400).send({ code: ERROR_CODE.AU00 });
        return;
    }

    try {
        await jwtVerify(token, SECRET_KEY);
        next();
    } catch {
        res.status(400).send({ code: ERROR_CODE.AU00 });
        return;
    }
};

export default middleware;
