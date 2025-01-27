import httpResponseCodes from "../utils/error/httpCodes";
import { IError } from "../models/interfaces/IError";

class ErrorHandler extends Error {
    status: number;
    constructor(statusCode: number, message: string) {
        super();
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = statusCode;
        this.message = message;
    }
}

function getErrorMessage(error: any): string {
    if (error?.response?.data?.message !== undefined) {
        return error?.response?.data?.message as string
    }
    if (error instanceof Error && error.message !== undefined) {
        return error.message;
    }
    const responseCode = getErrorCode(error);
    return httpResponseCodes[responseCode];
}

function getErrorCode(error: unknown): number {
    if (error instanceof Error) {
        const e = error as unknown as IError;
        return e?.status || e?.response?.status || 999;
    }
    return 999;
}

export { ErrorHandler, getErrorMessage, getErrorCode }