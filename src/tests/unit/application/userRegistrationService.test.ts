import {UserRegistrationRequest} from "../../../application/dtos";
import {Email} from "../../../core/valueObjects/email";
import {UserRegistrationService, UserRegistrationServiceNew} from "../../../application/userRegistrationService";
import {InMemoryUserRepository, InMemoryUserRepositoryNew} from "../../../core/repositories/userRepository";

describe('The User Registration Service', () => {
    let userRepository: InMemoryUserRepository;
    let userRegistrationService: UserRegistrationService;

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        userRegistrationService = new UserRegistrationService(userRepository);
    });

    it('registers a new user successfully', async () => {
        const registrationRequest: UserRegistrationRequest = {
            email: 'test@example.com',
            password: 'TestPass123_'
        };

        await userRegistrationService.register(registrationRequest);

        const storedUser = await userRepository.findByEmail(Email.create(registrationRequest.email));
        storedUser.fold(
            () => fail('User not found'),
            (user) => expect(user.isMatchingEmail(Email.create(registrationRequest.email))).toBe(true))
    });

    it('does not allow to register an user when an user with the same email already exists', async () => {
        const registrationRequest: UserRegistrationRequest = {
            email: 'test@example.com',
            password: 'TestPass123_'
        };
        await userRegistrationService.register(registrationRequest);

        await expect(userRegistrationService.register(registrationRequest))
            .rejects
            .toThrow('User already exists with this email.');
    });
});

describe('The New User Registration Service', () => {
    let userRepository: InMemoryUserRepositoryNew;
    let userRegistrationService: UserRegistrationServiceNew;

    beforeEach(() => {
        userRepository = new InMemoryUserRepositoryNew();
        userRegistrationService = new UserRegistrationServiceNew(userRepository);
    });

    it('registers a new user successfully',  () => {
        const registrationRequest: UserRegistrationRequest = {
            email: 'test@example.com',
            password: 'TestPass123_'
        };

        userRegistrationService.register(registrationRequest)
            .run(()=>{}, ()=>{});

        userRepository.findByEmail(Email.create(registrationRequest.email)).run(
            maybeUser => maybeUser.fold(
                ()=> fail('User not found'),
                user => expect(user.isMatchingEmail(Email.create(registrationRequest.email))).toBe(true)
            ),
            ()=> fail('User not found')
        );
    });

    it('does not allow to register an user when an user with the same email already exists',  () => {
        const registrationRequest: UserRegistrationRequest = {
            email: 'test@example.com',
            password: 'TestPass123_'
        };
        userRegistrationService.register(registrationRequest)
            .run(()=>{}, ()=>{});
        userRegistrationService.register(registrationRequest).run(()=>{}, (e)=>{
            expect(e.message).toBe('User already exists with this email.');
        });
    });
});
