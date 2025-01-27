import { Request, Response, NextFunction } from "express";
import DeviceDetector from 'device-detector-js';
import taskController from "../taskController";
import taskService from "../../services/taskService";
import { ErrorHandler } from "../../services/errorHandlerService";

jest.mock("../../services/taskService");
jest.mock("device-detector-js");

describe("Task Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            headers: {},
            ip: "127.0.0.1",
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            redirect: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe("shortUrl", () => {
        it("should create a short URL and return a response", async () => {
            const mockResponse = { status: 200, message: "Success", data: { shortUrl: "http://short.url/test" } };
            (taskService.shortUrl as jest.Mock).mockResolvedValue(mockResponse);

            req.body = { longUrl: "https://example.com" };
            req.user = { email: "test@example.com" };

            await taskController.shortUrl(req as Request, res as Response, next);

            expect(taskService.shortUrl).toHaveBeenCalledWith(req.body, "test@example.com");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: mockResponse,
                message: mockResponse.message,
            });
        });

        it("should handle errors and call next with ErrorHandler", async () => {
            const mockError = new ErrorHandler(500, "Internal Server Error");
            (taskService.shortUrl as jest.Mock).mockRejectedValue(mockError);

            await taskController.shortUrl(req as Request, res as Response, next);

            expect(taskService.shortUrl).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });
});
