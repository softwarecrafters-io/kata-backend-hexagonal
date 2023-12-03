import {Email} from "../../../../core/valueObjects/email";

describe('The Email', () => {
    it('creates an email for a given address in a correct format', () => {
        const email = Email.create('example@example.com');
        expect(email.toString()).toBe('example@example.com');
    });

    it('does not allow creating an email for a given incorrectly formatted address', () => {
        expect(() => {
            Email.create('invalidEmail');
        }).toThrow('Invalid email format');
    });

    it('considers two Email objects with the same address as equal', () => {
        const email1 = Email.create('example@example.com');
        const email2 = Email.create('example@example.com');
        expect(email1.isEqual(email2)).toBe(true);
    });

    it('differentiates between two Email objects with different addresses', () => {
        const email1 = Email.create('example1@example.com');
        const email2 = Email.create('example2@example.com');
        expect(email1.isEqual(email2)).toBe(false);
    });
});
