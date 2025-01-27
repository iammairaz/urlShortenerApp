import { APIResponse, ResponseWithObject } from "../status";

describe("Status Utility Tests", () => {
    it("should create an APIResponse instance", () => {
        const response = new APIResponse(200, "OK");
        expect(response.status).toBe(200);
        expect(response.message).toBe("OK");
    });

    it("should create a ResponseWithObject instance", () => {
        const data = { key: "value" };
        const response: any = new ResponseWithObject(201, "Created", data);
        expect(response.status).toBe(201);
        expect(response.message).toBe("Created");
        expect(response.details).toEqual(data);
    });
});
