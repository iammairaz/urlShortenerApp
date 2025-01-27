import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const googleAuthRedirect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user as any;
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );
        res.status(200).json({
            message: "Authentication successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        next(error);
    }
};


const getUserProfile = (req: Request, res: Response) => {
    res.json({ user: req.user });
};

export default { googleAuthRedirect, getUserProfile };
