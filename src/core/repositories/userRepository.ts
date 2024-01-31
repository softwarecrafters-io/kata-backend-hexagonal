import {User} from "../entities/user";
import {Id} from "../valueObjects/id";
import {Email} from "../valueObjects/email";
import {Maybe} from "../common/maybe";

export interface UserRepository {
    save(user: User): Promise<void>;
    findById(id: Id): Promise<Maybe<User>>;
    findByEmail(email: Email): Promise<Maybe<User>>;
    findAll(): Promise<User[]>;
    remove(user: User): Promise<void>;
}

export class InMemoryUserRepository implements UserRepository {
    private users: User[] = [];

    async save(user: User): Promise<void> {
        const index = this.users.findIndex(u => u.isEquals(user));
        const notFoundIndex = -1;
        index === notFoundIndex ? this.users.push(user) : this.users[index] = user;
    }

    async findById(id: Id): Promise<Maybe<User>> {
        return Maybe.of(this.users.find(user => user.isMatchingId(id)));
    }

    async findByEmail(email: Email): Promise<Maybe<User>> {
        return Maybe.of(this.users.find(user => user.isMatchingEmail(email)));
    }

    async findAll(): Promise<User[]> {
        return [...this.users];
    }

    async remove(user: User): Promise<void> {
        this.users = this.users.filter(u => !u.isEquals(user));
    }
}
