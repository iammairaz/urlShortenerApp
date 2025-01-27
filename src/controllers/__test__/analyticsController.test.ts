import analyticsController from "../analyticsController";
import analyticsService from "../../services/analyticsService";
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../../services/errorHandlerService";

jest.mock("../../services/analyticsService");

describe("Analytics Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = {
      params: {},
      user: { email: "test@example.com" }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("analysisByAlias", () => {
    it("should return data when service returns a response", async () => {
      const mockResponse = {
        status: 200,
        message: "Success",
        details: { alias: "test-alias", clicks: 100 }
      };
      (analyticsService.analysisByAlias as jest.Mock).mockResolvedValue(mockResponse);

      req.params!.alias = "test-alias";

      await analyticsController.analysisByAlias(req as Request, res as Response, next);

      expect(analyticsService.analysisByAlias).toHaveBeenCalledWith("test-alias");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockResponse,
        message: mockResponse.message
      });
    });

    it("should call next with an error when service throws an error", async () => {
      const mockError = new ErrorHandler(400, "Alias not found");
      (analyticsService.analysisByAlias as jest.Mock).mockRejectedValue(mockError);

      req.params!.alias = "test-alias";

      await analyticsController.analysisByAlias(req as Request, res as Response, next);

      expect(analyticsService.analysisByAlias).toHaveBeenCalledWith("test-alias");
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe("analysisByTopic", () => {
    it("should return data when service returns a response", async () => {
      const mockResponse = {
        status: 200,
        message: "Success",
        details: { topic: "test-topic", clicks: 200 }
      };
      (analyticsService.analysisByTopic as jest.Mock).mockResolvedValue(mockResponse);

      req.params!.topic = "test-topic";

      await analyticsController.analysisByTopic(req as Request, res as Response, next);

      expect(analyticsService.analysisByTopic).toHaveBeenCalledWith("test-topic");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockResponse,
        message: mockResponse.message
      });
    });

    it("should call next with an error when service throws an error", async () => {
      const mockError = new ErrorHandler(400, "Topic not found");
      (analyticsService.analysisByTopic as jest.Mock).mockRejectedValue(mockError);

      req.params!.topic = "test-topic";

      await analyticsController.analysisByTopic(req as Request, res as Response, next);

      expect(analyticsService.analysisByTopic).toHaveBeenCalledWith("test-topic");
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe("analysisByUser", () => {
    it("should return data when service returns a response", async () => {
      const mockResponse = {
        status: 200,
        message: "Success",
        details: { user: "test@example.com", clicks: 300 }
      };
      (analyticsService.analysisByUser as jest.Mock).mockResolvedValue(mockResponse);

      await analyticsController.analysisByUser(req as Request, res as Response, next);

      expect(analyticsService.analysisByUser).toHaveBeenCalledWith("test@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockResponse,
        message: mockResponse.message
      });
    });

    it("should call next with an error when service throws an error", async () => {
      const mockError = new ErrorHandler(400, "User data not found");
      (analyticsService.analysisByUser as jest.Mock).mockRejectedValue(mockError);

      await analyticsController.analysisByUser(req as Request, res as Response, next);

      expect(analyticsService.analysisByUser).toHaveBeenCalledWith("test@example.com");
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
