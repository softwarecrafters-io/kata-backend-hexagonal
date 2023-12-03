import {ValidationError} from "../common/error";

export class Email {
    private constructor(private readonly value: string) {}

    private static isValidEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static create(email: string): Email {
        if (!this.isValidEmail(email)) {
            throw new ValidationError('Invalid email format');
        }
        return new Email(email);
    }

    isEqual(otherEmail: Email): boolean {
        return this.value === otherEmail.value;
    }

    toString(): string {
        return this.value;
    }
}
