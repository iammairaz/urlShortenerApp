import { generateUniqueId } from "../common";

describe("Common Utils", () => {
    it("should generate a unique ID", () => {
        const id1 = generateUniqueId();
        const id2 = generateUniqueId();
        expect(id1).not.toBe(id2);
        expect(id1).toHaveLength(14);
    });
});
