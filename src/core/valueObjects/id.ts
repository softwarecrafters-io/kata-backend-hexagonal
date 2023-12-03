import {generateUuid} from "../common/uuid";
import {ValidationError} from "../common/error";

export class Id {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static generateUniqueId(): Id {
        return new Id(generateUuid());
    }

    static createFrom(id: string): Id {
        if (!this.isValidIdentifier(id)) {
            throw new ValidationError('Invalid Id format');
        }
        return new Id(id);
    }

    private static isValidIdentifier(id: string): boolean {
        const regexForUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        return regexForUuid.test(id);
    }

    equals(otherId: Id): boolean {
        return this.value === otherId.value;
    }

    toString(): string {
        return this.value;
    }
}
