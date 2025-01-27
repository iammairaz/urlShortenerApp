import { NextFunction, Request, Response } from "express";
import { getErrorCode, getErrorMessage } from "../services/errorHandlerService";
import { logger } from "../utils";
import { SOMETHING_WENT_WRG } from "../utils/messages/message";

function errorMiddleware(error: any, request: Request, response: Response, next: NextFunction) {
    try {
        const status = error?.status || getErrorCode(error) || 500;
        const message = error?.message || getErrorMessage(error) || SOMETHING_WENT_WRG;
        response.status(status).json({
            status,
            message
        });
        logger.error(getErrorMessage(error));
    } catch (e: unknown) {
        response.status(getErrorCode(e)).json({
            status: getErrorCode(e),
            message: getErrorMessage(e)
        })
        logger.error(getErrorMessage(e))
    }
}

export default errorMiddleware;