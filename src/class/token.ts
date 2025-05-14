import { v7 as uuidv7 } from "uuid";
import { randomBytes } from "crypto";

class UUID {
    v7(): string {
        return uuidv7();
    }
    generateToken(length: number) {
        return randomBytes(length).toString("hex");
    }
}

export default new UUID();
