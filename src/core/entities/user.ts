import {Email} from "../valueObjects/email";
import {Id} from "../valueObjects/id";
import {Password} from "../valueObjects/password";
import {ValidationError} from "../common/error";
import {Either} from "../common/monads/either";

export class User {
    constructor(
        private readonly id: Id,
        private readonly email: Email,
        private password: Password
    ) {}

    changePassword(newPassword: Password): void {
        if (this.isMatchingPassword(newPassword)) {
            throw new ValidationError('New password must be different');
        }
        this.password = newPassword;
    }

    changeSafePassword(newPassword: Password): Either<ValidationError, void> {
        return Either.fromTry(() => this.changePassword(newPassword));
    }

    isMatchingPassword(password: Password): boolean {
        return this.password.isEquals(password);
    }

    isMatchingId(id: Id): boolean {
        return this.id.equals(id);
    }

    isMatchingEmail(email: Email): boolean {
        return this.email.isEqual(email);
    }

    isEquals(user: User): boolean {
        return this.id.equals(user.id);
    }

    toDto() {
        return {
            id: this.id.toString(),
            email: this.email.toString()
        };
    }
}
