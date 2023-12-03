import {createHash} from "crypto";

export function hash(plainText: string): string {
    return createHash('sha256').update(plainText).digest('hex');
}
