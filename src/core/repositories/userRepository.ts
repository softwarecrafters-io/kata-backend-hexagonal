import {User} from "../entities/user";
import {Id} from "../valueObjects/id";
import {Email} from "../valueObjects/email";

import {Maybe} from "../common/monads/maybe";
import {Task} from "../common/monads/task";

export interface UserRepository {
    save(user: User): Promise<void>;
    findById(id: Id): Promise<Maybe<User>>;
    findByEmail(email: Email): Promise<Maybe<User>>;
    findAll(): Promise<User[]>;
    remove(user: User): Promise<void>;
}

export interface UserRepositoryNew {
    save(user: User): Task<void>;
    findById(id: Id): Task<Maybe<User>>;
    findByEmail(email: Email): Task<Maybe<User>>;
    findAll(): Task<User[]>;
    remove(user: User): Task<void>;
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

export class InMemoryUserRepositoryNew implements UserRepositoryNew {
    private users: User[] = [];

    save(user: User): Task<void> {
        return Task.fromTry(()=> {
            const index = this.users.findIndex(u => u.isEquals(user));
            const notFoundIndex = -1;
            index === notFoundIndex ? this.users.push(user) : this.users[index] = user;
        });
    }

    findById(id: Id): Task<Maybe<User>> {
        return Task.of(Maybe.of(this.users.find(user => user.isMatchingId(id))));
    }

    findByEmail(email: Email): Task<Maybe<User>> {
        return Task.of(Maybe.of(this.users.find(user => user.isMatchingEmail(email))));
    }

    findAll(): Task<User[]> {
        return Task.of([...this.users]);
    }

    remove(user: User): Task<void> {
        return Task.fromTry(()=> {
            this.users = this.users.filter(u => !u.isEquals(user));
        });
    }
}
