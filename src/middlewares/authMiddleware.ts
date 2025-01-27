import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(403).json({ message: "Unauthorized: No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
