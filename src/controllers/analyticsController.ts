import { Request, Response, NextFunction } from "express";
import analyticsService from "../services/analyticsService";
import { ErrorHandler, getErrorCode, getErrorMessage } from "../services/errorHandlerService";
const analysisByAlias = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const alias = req.params.alias;
        const response = await analyticsService.analysisByAlias(alias);
        if (response) {
            return res.status(response.status).json({
                data: response,
                message: response.message
            })
        }
    } catch (error) {
        return next(new ErrorHandler(getErrorCode(error), getErrorMessage(error)))
    }
}
const analysisByTopic = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const topic = req.params.topic;
        const response = await analyticsService.analysisByTopic(topic);
        if (response) {
            return res.status(response.status).json({
                data: response,
                message: response.message
            })
        }
    } catch (error) {
        return next(new ErrorHandler(getErrorCode(error), getErrorMessage(error)))
    }
}
const analysisByUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userDetail:any = req.user;
        const response = await analyticsService.analysisByUser(userDetail.email);
        if (response) {
            return res.status(response.status).json({
                data: response,
                message: response.message
            })
        }
    } catch (error) {
        return next(new ErrorHandler(getErrorCode(error), getErrorMessage(error)))
    }
}

export default {
    analysisByAlias,
    analysisByTopic,
    analysisByUser
}