import { body, ValidationChain, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ErrorHandler, getErrorCode, getErrorMessage } from "../services/errorHandlerService";
import { BASE, TOPIC } from "../services/constantService";

const shortUrl = () => [
    body("longUrl")
        .isURL()
        .withMessage("Invalid URL format. Please provide a valid URL."),
    body("customAlias")
        .optional()
        .isString()
        .withMessage("Custom Alias must be a string.")
        .isLength({max:14})
        .withMessage("Maximum 14 characters are allowed"),
    body("topic")
        .optional()
        .isString()
        .withMessage("Topic must be a string.")
        .isIn(Object.values(TOPIC))
        .withMessage("Only valid topics are allowed")
];

const errorReporter = (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const [errorObj] = errors.array({onlyFirstError:true});
        throw new ErrorHandler(400,errorObj.msg);
    } catch (error) {
        return next(new ErrorHandler(getErrorCode(error), getErrorMessage(error)))
    }
}

export default {
    shortUrl: [shortUrl(), errorReporter] as ValidationChain[],
}