import bcrypt from "bcrypt";

class Crypt {
    async hash(value: string): Promise<string> {
        return await bcrypt.hash(value, Number(process.env.HASH_MDP));
    }

    async compare(value: string, valueHash: string): Promise<boolean> {
        return await bcrypt.compare(value, valueHash);
    }
}

export const crypt = new Crypt();
