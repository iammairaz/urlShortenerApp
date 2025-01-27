import { Request, Response, NextFunction } from "express";
import DeviceDetector from 'device-detector-js';
import { ErrorHandler, getErrorCode, getErrorMessage } from "../services/errorHandlerService";
import taskService from "../services/taskService";

const shortUrl = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const urlDetail = req.body;
        const userDetail:any = req.user;
        const response = await taskService.shortUrl(urlDetail,userDetail?.email);
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
const redirecTo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const alias = req.params.alias;
        const ip = req.headers["x-forwarded-for"]?req.headers["x-forwarded-for"]:req.ip;
        const userAgent = req.headers['user-agent'] || '';
        const deviceDetector = new DeviceDetector();
        const device = deviceDetector.parse(userAgent);
        const osType = device.os?.name || 'Unknown OS';
        const deviceType = device.device?.type || 'Unknown Device';
        const response = await taskService.redirectTo(alias, ip, osType, deviceType);
        if (response) {
            return res.redirect(response.details.origUrl)
        }
    } catch (error) {
        return next(new ErrorHandler(getErrorCode(error), getErrorMessage(error)))
    }
}

export default {
    shortUrl,
    redirecTo
}