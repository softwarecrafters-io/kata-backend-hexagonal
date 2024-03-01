import {Db, MongoClient, ObjectId} from 'mongodb';
import {User} from "../../core/entities/user";
import {UserRepository} from "../../core/repositories/userRepository";
import {Maybe} from "../../core/common/maybe";
import {Id} from "../../core/valueObjects/id";
import {Email} from "../../core/valueObjects/email";

type UserDto = {
    id: string,
    email: string,
    password: string
}

export class UserMongoRepository implements UserRepository {
    private readonly collectionName = 'users';
    constructor(private readonly db:Db){}

    async save(user: User): Promise<void> {
        const collection = this.db.collection(this.collectionName);
        if (await collection.findOne({ id: user.toDto().id.toString() })) {
            await collection.updateOne({ id: user.toDto().id.toString() }, { $set: user.toDto() });
        } else {
            await collection.insertOne(user.toDto());
        }
    }

    async findById(id: Id): Promise<Maybe<User>> {
        const collection = this.db.collection(this.collectionName);
        const document = await collection.findOne<UserDto>({ id: id.toString() });
        return document ? Maybe.of(User.fromDto(document)) : Maybe.nothing();
    }

    async findByEmail(email: Email): Promise<Maybe<User>> {
        const collection = this.db.collection(this.collectionName);
        const document = await collection.findOne<UserDto>({ email: email.toString() });
        return document ? Maybe.of(User.fromDto(document)) : Maybe.nothing();
    }

    async findAll(): Promise<User[]> {
        const collection = this.db.collection(this.collectionName);
        const documents = await collection.find<UserDto>({}).toArray();
        return documents.map(doc => User.fromDto(doc));
    }

    async remove(user: User): Promise<void> {
        const collection = this.db.collection(this.collectionName);
        await collection.deleteOne({ id: user.toDto().id.toString() });
    }
}

export async function initializeDatabase(connectionString: string, dbName: string) {
    const client = new MongoClient(connectionString);
    await client.connect();
    const db = client.db(dbName);
    return db;
}

