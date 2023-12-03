import {Password} from "../../../../core/valueObjects/password";

describe('The Password', () => {
    it('creates a password when the given value meets the requirements for a strong password', () => {
        expect(Password.createFromPlainText('1234abcdABCD_')).toBeInstanceOf(Password);
    });

    it('fails when the password is too short', () => {
        expect(() => {
            Password.createFromPlainText('1aA_');
        }).toThrow('Password is too short');
    });

    it('fails when the password is missing a number', () => {
        expect(() => {
            Password.createFromPlainText('abcdABCD_');
        }).toThrow('Password must contain a number');
    });

    it('fails when the password is missing a lowercase', () => {
        expect(() => {
            Password.createFromPlainText('1234ABCD_');
        }).toThrow('Password must contain a lowercase letter');
    });

    it('fails when the password is missing an uppercase', () => {
        expect(() => {
            Password.createFromPlainText('1234abcd_');
        }).toThrow('Password must contain an uppercase letter');
    });

    it('fails when the password is missing an underscore', () => {
        expect(() => {
            Password.createFromPlainText('1234abcdABCD');
        }).toThrow('Password must contain an underscore');
    });

    it('fails when the password is missing several requirements', () => {
        expect(() => {
            Password.createFromPlainText('abcd');
        }).toThrow('Password is too short, Password must contain a number, Password must contain an uppercase letter, Password must contain an underscore');
    });

    it('can be created from plain text and matches the original text', () => {
        const originalPassword = '1234abcdABCD_';
        const password = Password.createFromPlainText(originalPassword);
        const samePassword = Password.createFromPlainText(originalPassword);
        expect(password.isEquals(samePassword)).toBe(true);
    });

    it('does not match a different password', () => {
        const password = Password.createFromPlainText('SecurePass123_');
        const otherPassword = Password.createFromPlainText('DifferentPass456_');
        expect(password.isEquals(otherPassword)).toBe(false);
    });

    it('ensures password is hashed', () => {
        const originalPassword = '1234abcdABCD_';
        const password = Password.createFromPlainText(originalPassword);
        const hashedValue = password.toString();

        expect(hashedValue).not.toBe(originalPassword);
        expect(hashedValue.length).toBe(64);
        expect(/^[a-fA-F0-9]{64}$/.test(hashedValue)).toBe(true);
    });
});
