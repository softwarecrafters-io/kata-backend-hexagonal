import {hash} from "../common/hash";
import {ValidationError} from "../common/error";

export class Password {
    private readonly value: string;

    private constructor(hashedPassword: string) {
        this.value = hashedPassword;
    }

    static createFromHash(hashedPassword: string): Password {
        return new Password(hashedPassword);
    }

    static createFromPlainText(plainText: string): Password {
        const errors = this.validatePassword(plainText);
        if (errors.length) {
            throw new ValidationError(errors.join(', '));
        }
        return new Password(this.hashPassword(plainText));
    }

    private static hashPassword(plainText: string): string {
        return hash(plainText);
    }

    isEquals(password: Password): boolean {
        return this.value === password.value;
    }

    toString(): string {
        return this.value;
    }

    private static validatePassword(password: string): string[] {
        const errors: string[] = [];
        if (!this.hasSixCharactersOrMore(password))
            errors.push('Password is too short');
        if (!this.containsNumber(password))
            errors.push('Password must contain a number');
        if (!this.containsLowerCase(password))
            errors.push('Password must contain a lowercase letter');
        if (!this.containsUpperCase(password))
            errors.push('Password must contain an uppercase letter');
        if (!this.containsUnderscore(password))
            errors.push('Password must contain an underscore');
        return errors;
    }

    private static hasSixCharactersOrMore(password: string): boolean {
        return password.length >= 6;
    }

    private static containsNumber(password: string): boolean {
        return /.*\d.*/.test(password);
    }

    private static containsLowerCase(password: string): boolean {
        return /.*[a-z].*/.test(password);
    }

    private static containsUpperCase(password: string): boolean {
        return /.*[A-Z].*/.test(password);
    }

    private static containsUnderscore(password: string): boolean {
        return password.includes('_');
    }
}
