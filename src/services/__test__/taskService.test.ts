import taskService from "../../services/taskService";
import { UrlSchema } from "../../models/dbSchemas/urlSchema";
import { redirectSchema } from "../../models/dbSchemas/redirectSchema";
import { generateUniqueId } from "../../utils/common/common";
import { ResponseWithObject } from "../../utils/status/status";
import { ErrorHandler } from "../../services/errorHandlerService";
import { BASE } from "../constantService";
import { SUCCESS_MSG } from "../../utils/messages/message";

// Mock dependencies
jest.mock("../../models/dbSchemas/urlSchema");
jest.mock("../../models/dbSchemas/redirectSchema");
jest.mock("../../utils/common/common");

describe("Task Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new short URL when customAlias is not provided", async () => {
        const mockRequest = { longUrl: "https://example.com" };
        const mockResponse = {
            shortUrl: "http://localhost:3000/api/task/redirect/unique-id",
            createdAt: new Date(),
        };
    
        (generateUniqueId as jest.Mock).mockReturnValue("unique-id");
        (UrlSchema.findOneAndUpdate as jest.Mock).mockResolvedValue(mockResponse);
    
        const result = await taskService.shortUrl(mockRequest, "test@example.com");
    
        expect(generateUniqueId).toHaveBeenCalled();
        expect(UrlSchema.findOneAndUpdate).toHaveBeenCalledWith(
            { origUrl: mockRequest.longUrl },
            expect.objectContaining({
                $set: expect.objectContaining({
                    createdBy: "test@example.com",
                    origUrl: "https://example.com",
                    shortUrl: "http://localhost:3000/api/task/redirect/unique-id",
                    urlId: "unique-id",
                }),
            }),
            { new: true, upsert: true }
        );
        expect(result).toEqual(new ResponseWithObject(200, SUCCESS_MSG, mockResponse));
    });
    

    describe("redirectTo", () => {
        it("should redirect to the original URL and save user details", async () => {
            const mockAlias = "alias";
            const mockIp = "127.0.0.1";
            const mockOsType = "Windows";
            const mockDeviceType = "Desktop";

            const mockUrlData = {
                urlId: mockAlias,
                origUrl: "https://example.com",
                topic: "test-topic",
            };
            (UrlSchema.findOne as jest.Mock).mockResolvedValue(mockUrlData);
            (redirectSchema.prototype.save as jest.Mock).mockResolvedValue(true);
            (UrlSchema.updateOne as jest.Mock).mockResolvedValue(true);

            const result: any = await taskService.redirectTo(mockAlias, mockIp, mockOsType, mockDeviceType);

            expect(UrlSchema.findOne).toHaveBeenCalledWith({ urlId: mockAlias });
            expect(redirectSchema.prototype.save).toHaveBeenCalled();
            expect(UrlSchema.updateOne).toHaveBeenCalledWith(
                { origUrl: mockUrlData.origUrl },
                { $inc: { clicks: 1 } }
            );
            expect(result).toBeInstanceOf(ResponseWithObject);
            expect(result.details.origUrl).toBe(mockUrlData.origUrl);
        });

        it("should throw an error if alias is not found", async () => {
            (UrlSchema.findOne as jest.Mock).mockResolvedValue(null);

            await expect(
                taskService.redirectTo("invalid-alias", "127.0.0.1", "Windows", "Desktop")
            ).rejects.toThrow(new ErrorHandler(404, "No data available"));

            expect(UrlSchema.findOne).toHaveBeenCalledWith({ urlId: "invalid-alias" });
        });
    });
});
