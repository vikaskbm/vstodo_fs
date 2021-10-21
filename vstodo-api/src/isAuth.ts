import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";

export type ReqWithUserId = Request<{}, any, any, {}, Record<string, any>> & {userId: number};

export const isAuth: RequestHandler<{}, any, any, {}> = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        throw new Error('Not Authenticated');
    }
    const token = authHeader.split(" ")[1];
    if(!token) {
        throw new Error('Not Authenticated');
    }
    
    let userId = '';

    try {
        const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        (req as any).userId = payload.userId;
        next();
        return;
    } catch {}

    throw new Error('Not Authenticated')
}