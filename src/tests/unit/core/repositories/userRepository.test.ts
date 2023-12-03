import {User} from "../../../../core/entities/user";
import {Email} from "../../../../core/valueObjects/email";
import {Id} from "../../../../core/valueObjects/id";
import {Password} from "../../../../core/valueObjects/password";
import {InMemoryUserRepository, UserRepository} from "../../../../core/repositories/userRepository";

describe('The In Memory User Repository', ()=>{
    let repo: InMemoryUserRepository;

    beforeEach(()=>{
        repo = new InMemoryUserRepository();
    });

    it('finds a user by ID', async ()=>{
        const id = Id.generateUniqueId();
        const user = createUserById(id);
        await repo.save(user);

        const foundUser = await repo.findById(id);

        expect(foundUser).toEqual(user);
    });

    it('does not find a non-existing user by ID', async ()=>{
        const id = Id.generateUniqueId();

        const foundUser = await repo.findById(id);

        expect(foundUser).toBeUndefined();
    });

    it('finds a user by Email', async ()=>{
        const email = Email.create('test@example.com')
        const user = createUserByEmail(email);
        await repo.save(user);

        const foundUser = await repo.findByEmail(email);

        expect(foundUser).toEqual(user);
    });

    it('does not find a non-existing user by Email', async ()=>{
        const email = Email.create('test@example.com')

        const foundUser = await repo.findByEmail(email);

        expect(foundUser).toBeUndefined();
    });

    it('finds all users', async ()=>{
        const aUser = createUserByEmail(Email.create('test1@example.com'));
        const anotherUser = createUserByEmail(Email.create('test2@example.com'));
        await repo.save(aUser);
        await repo.save(anotherUser);

        const users = await repo.findAll();

        expect(users).toHaveLength(2);
        expect(users).toEqual([aUser, anotherUser]);
    });

    it('finds no users when the repository is empty', async ()=>{
        const users = await repo.findAll();

        expect(users).toHaveLength(0);
        expect(users).toEqual([]);
    });

    it('removes an user', async ()=>{
        const email = Email.create('test@example.com')
        const user = createUserByEmail(email);
        await repo.save(user);

        await repo.remove(user);
        const foundUser = await repo.findByEmail(email);

        expect(foundUser).toBeUndefined();
    });

    it('updates an user when its already exists', async ()=>{
        const aUser = createUserByEmail(Email.create('test1@example.com'));
        const sameUser = aUser;
        await repo.save(aUser);
        await repo.save(sameUser);

        const users = await repo.findAll();

        expect(users).toHaveLength(1);
        expect(users).toEqual([aUser]);
    })
});

function createUserById(id: Id) {
    const password = Password.createFromPlainText('TestPass123_');
    const email = Email.create('test@example.com')
    return new User(id, email, password);
}

function createUserByEmail(email: Email) {
    const id = Id.generateUniqueId();
    const password = Password.createFromPlainText('TestPass123_');
    return new User(id, email, password);
}
