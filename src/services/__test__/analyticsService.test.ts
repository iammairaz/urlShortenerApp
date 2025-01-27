import analysisService from "../analyticsService";
import { redirectSchema } from "../../models/dbSchemas/redirectSchema";
import { UrlSchema } from "../../models/dbSchemas/urlSchema";
import { SUCCESS_MSG, NO_DATA_AVL_MSG } from "../../utils/messages/message";
import { ErrorHandler } from "../errorHandlerService";
import { BASE } from "../constantService";

jest.mock("../../models/dbSchemas/redirectSchema");
jest.mock("../../models/dbSchemas/urlSchema");

describe("Analysis Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("analysisByAlias", () => {
        it("should return analytics data for the alias", async () => {
            const mockData = [
                {
                    totalClicks: 100,
                    uniqueUsers: 20,
                    clicksByDate: [{ date: "2023-01-01", clicks: 50 }],
                    osType: [{ osName: "Windows", uniqueClicks: 50, uniqueUsers: 10 }],
                    deviceType: [{ deviceName: "Mobile", uniqueClicks: 30, uniqueUsers: 5 }],
                },
            ];

            (redirectSchema.aggregate as jest.Mock).mockResolvedValue(mockData);

            const result = await analysisService.analysisByAlias("test-alias");
            expect(redirectSchema.aggregate).toHaveBeenCalledTimes(1);
            expect(redirectSchema.aggregate).toHaveBeenCalledWith(expect.any(Array));
            expect(result).toEqual({
                status: 200,
                message: SUCCESS_MSG,
                details: mockData,
            });
        });

        it("should throw an error if no data is found", async () => {
            (redirectSchema.aggregate as jest.Mock).mockResolvedValue(new ErrorHandler(400, NO_DATA_AVL_MSG));

            await expect(analysisService.analysisByAlias("test-alias1")).rejects.toThrowError(
                new ErrorHandler(400, NO_DATA_AVL_MSG)
            );
        });

    });

    describe("analysisByTopic", () => {
        it("should return analytics data for the topic", async () => {
            const mockData = [
                {
                    totalClicks: 50,
                    uniqueUsers: 15,
                    clicksByDate: [{ date: "2023-01-01", totalClicks: 20 }],
                    urls: [{ shortUrl: `${BASE}/test`, totalClicks: 20, uniqueUsers: 5 }],
                },
            ];

            (redirectSchema.aggregate as jest.Mock).mockResolvedValue(mockData);

            const result = await analysisService.analysisByTopic("test-topic");

            expect(redirectSchema.aggregate).toHaveBeenCalledTimes(1);
            expect(redirectSchema.aggregate).toHaveBeenCalledWith(expect.any(Array));
            expect(result).toEqual({
                status: 200,
                message: SUCCESS_MSG,
                details: mockData,
            });
        });

        it("should throw an error if no data is found", async () => {
            (redirectSchema.aggregate as jest.Mock).mockResolvedValue([]);

            await expect(analysisService.analysisByTopic("test-topic")).rejects.toThrowError(
                new ErrorHandler(400, NO_DATA_AVL_MSG)
            );
        });
    });

    describe("analysisByUser", () => {
        it("should return analytics data for the user", async () => {
            const mockData = [
                {
                    totalUrls: 10,
                    totalClicks: 100,
                    uniqueUsers: 30,
                    clicksByDate: [{ date: "2023-01-01", totalClicks: 50 }],
                    osType: [{ osName: "Windows", uniqueClicks: 50, uniqueUsers: 15 }],
                    deviceType: [{ deviceName: "Desktop", uniqueClicks: 40, uniqueUsers: 10 }],
                },
            ];

            (UrlSchema.aggregate as jest.Mock).mockResolvedValue(mockData);

            const result = await analysisService.analysisByUser("test@example.com");

            expect(UrlSchema.aggregate).toHaveBeenCalledTimes(1);
            expect(UrlSchema.aggregate).toHaveBeenCalledWith(expect.any(Array));
            expect(result).toEqual({
                status: 200,
                message: SUCCESS_MSG,
                details: mockData,
            });
        });

        it("should throw an error if no data is found", async () => {
            (UrlSchema.aggregate as jest.Mock).mockResolvedValue([]);

            await expect(analysisService.analysisByUser("test@example.com")).rejects.toThrowError(
                new ErrorHandler(400, NO_DATA_AVL_MSG)
            );
        });
    });
});
