import { fromBuffer } from "file-type";
import mime from "mime-types";
import fs from "fs/promises";

class FileType {
    async detectMimeFromBuffer(buffer: Buffer): Promise<string | null> {
        const result = await fromBuffer(buffer);
        return result?.mime || null;
    }

    async detectMimeFromFile(filePath: string): Promise<string | null> {
        try {
            const buffer = await fs.readFile(filePath);
            return this.detectMimeFromBuffer(buffer);
        } catch {
            return null;
        }
    }

    getExtensionFromMime(mimeType: string): string | null {
        return mime.extension(mimeType) || null;
    }

    isImage(mimeType: string): boolean {
        return /^image\//.test(mimeType);
    }

    isPdf(mimeType: string): boolean {
        return mimeType === "application/pdf";
    }
}

export const fileType = new FileType();
