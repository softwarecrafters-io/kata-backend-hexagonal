import {UserRepository} from "../../core/repositories/userRepository";
import {User} from "../../core/entities/user";
import * as fs from "fs";
import * as path from "path";
import {Maybe} from "../../core/common/maybe";
import {Id} from "../../core/valueObjects/id";
import {Email} from "../../core/valueObjects/email";

export class UserFileRepository implements UserRepository {
    constructor(private readonly path: string) {}

    static create(filename: string): UserFileRepository {
        const basePath = path.resolve(__dirname, '../../../data', filename);
        this.ensureThatFileIsCreated(basePath);
        return new UserFileRepository(basePath);
    }

    private static ensureThatFileIsCreated(filePath: string) {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]', 'utf8');
        }
    }

    async save(user: User): Promise<void> {
        const users = await this.findAll();
        const index = users.findIndex(u => u.isEquals(user));
        const notFoundIndex = -1;
        index === notFoundIndex
            ? users.push(user)
            : users[index] = user;
        await this.writeUsersToFile(users);
    }

    async findById(id: Id): Promise<Maybe<User>> {
        const users = await this.readUsersFromFile();
        return Maybe.of(users.find(user => user.isMatchingId(id)));
    }

    async findByEmail(email: Email): Promise<Maybe<User>> {
        const users = await this.readUsersFromFile();
        return Maybe.of(users.find(user => user.isMatchingEmail(email)));
    }

    async findAll(): Promise<User[]> {
        return await this.readUsersFromFile();
    }

    async remove(user: User): Promise<void> {
        let users = await this.readUsersFromFile();
        users = users.filter(u => !u.isEquals(user));
        await this.writeUsersToFile(users);
    }

    private async readUsersFromFile(): Promise<User[]> {
        const serializedData = fs.readFileSync(this.path, 'utf8');
        return JSON.parse(serializedData).map(dto => User.fromDto(dto));
    }

    private async writeUsersToFile(users: User[]): Promise<void> {
        const serializedData = JSON.stringify(users.map(user => user.toDto()));
        fs.writeFileSync(this.path, serializedData, 'utf8');
    }
}
