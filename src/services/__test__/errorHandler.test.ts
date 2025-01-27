import { IError } from "../../models/interfaces/IError";
import { ErrorHandler, getErrorMessage, getErrorCode } from "../../services/errorHandlerService";
import httpResponseCodes from "../../utils/error/httpCodes";

jest.mock("../../utils/error/httpCodes", () => ({
    400: "Bad Request",
    404: "Not Found",
    500: "Internal Server Error",
    999: "Unknown Error",
}));

describe("ErrorHandler Service", () => {
    describe("ErrorHandler class", () => {
        it("should create an instance with the provided status code and message", () => {
            const error = new ErrorHandler(404, "Resource not found");
            expect(error).toBeInstanceOf(ErrorHandler);
            expect(error.status).toBe(404);
            expect(error.message).toBe("Resource not found");
        });

        it("should inherit from the built-in Error class", () => {
            const error = new ErrorHandler(500, "Internal Server Error");
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe("getErrorMessage function", () => {
        it("should return the message from the error response if available", () => {
            const error = { response: { data: { message: "Custom error message" } } };
            const message = getErrorMessage(error);
            expect(message).toBe("Custom error message");
        });

        it("should return the error's message property if it is an instance of Error", () => {
            const error = new Error("Error message from instance");
            const message = getErrorMessage(error);
            expect(message).toBe("Error message from instance");
        });

        it("should return 'Unknown Error' if no matching response code is found", () => {
            const error = {};
            const message = getErrorMessage(error);
            expect(message).toBe("Unknown Error");
        });
    });

    describe("ErrorHandler Service", () => {
        describe("getErrorCode function", () => {
            it("should return the status from the error if it is an instance of Error", () => {
                const error = new ErrorHandler(404, "Not Found");
                const code = getErrorCode(error);
                expect(code).toBe(404);
            });

            it("should return 999 if no status is found", () => {
                const error = {};
                const code = getErrorCode(error);
                expect(code).toBe(999);
            });

            it("should return 999 if the error is not an instance of Error", () => {
                const error = "random string";
                const code = getErrorCode(error);
                expect(code).toBe(999);
            });
        });
    });


});
