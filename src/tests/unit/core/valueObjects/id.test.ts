import {Id} from "../../../../core/valueObjects/id";

describe('The Id Value Object', () => {
    it('generates a valid identifier', () => {
        const id = Id.generateUniqueId();
        const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        expect(id.toString()).toMatch(regex);
    });

    it('creates an Id  from a valid identifier', () => {
        const validUUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
        const id = Id.createFrom(validUUID);
        expect(id.toString()).toBe(validUUID);
    });

    it('does not allow to create an ID from a given invalid identifier', () => {
        const invalidUUID = 'invalid-uuid';
        expect(() => {
            Id.createFrom(invalidUUID);
        }).toThrow('Invalid Id format');
    });

    it('identifies two identical ids as equal', () => {
        const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
        const id1 = Id.createFrom(validId);
        const id2 = Id.createFrom(validId);
        expect(id1.equals(id2)).toBe(true);
    });

    it('distinguishes two different ids', () => {
        const id1 = Id.generateUniqueId();
        const id2 = Id.generateUniqueId();
        expect(id1.equals(id2)).toBe(false);
    });
});
