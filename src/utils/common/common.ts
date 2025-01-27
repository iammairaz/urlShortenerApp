const ShortUniqueId = require("short-unique-id");

export function generateUniqueId() {
    const uid = new ShortUniqueId();
    return uid.stamp(14)
}