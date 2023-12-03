import {User} from "../../../../core/entities/user";
import {Email} from "../../../../core/valueObjects/email";
import {Id} from "../../../../core/valueObjects/id";
import {Password} from "../../../../core/valueObjects/password";

describe('The User', () => {
    it('changes the password when a different one is provided', async () => {
        const user = createUser();
        const newPassword = await Password.createFromPlainText('NewPass456_');

        user.changePassword(newPassword);

        expect(user.isMatchingPassword(newPassword)).toBe(true);
    });

    it('does not allow to change password when the given one is the same', async () => {
        const user = createUser();
        const samePassword = Password.createFromPlainText('OriginalPass123_');

        expect(() => {
            user.changePassword(samePassword);
        }).toThrow('New password must be different');
    });
});

function createUser() {
    const id = Id.generateUniqueId();
    const email = Email.create('test@example.com');
    const password = Password.createFromPlainText('OriginalPass123_');
    return new User(id, email, password);
}
