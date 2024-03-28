import {UserRepository, UserRepositoryNew} from "../core/repositories/userRepository";
import {UserRegistrationRequest, UserRegistrationResponse} from "./dtos";
import {Email} from "../core/valueObjects/email";
import {Id} from "../core/valueObjects/id";
import {User} from "../core/entities/user";
import {Password} from "../core/valueObjects/password";
import {ValidationError} from "../core/common/error";

import {Either} from "../core/common/monads/either";
import {Task} from "../core/common/monads/task";

export class UserRegistrationService {
    constructor(private userRepository: UserRepository) {}

    async register(registrationRequest: UserRegistrationRequest): Promise<UserRegistrationResponse> {
        const { email, password } = registrationRequest;
        const maybeExistingUser = await this.userRepository.findByEmail(Email.create(email));
        maybeExistingUser.tap(()=> {
            throw new ValidationError('User already exists with this email.')
        });
        const user = this.createUser(email, password);
        await this.userRepository.save(user);
        return user.toDto();
    }

    private createUser(email: string, password: string) {
        return new User(
            Id.generateUniqueId(),
            Email.create(email),
            Password.createFromPlainText(password)
        );
    }
}

export class UserRegistrationServiceNew {
    constructor(private userRepository: UserRepositoryNew) {}

    register(registrationRequest: UserRegistrationRequest): Task<UserRegistrationResponse> {
        const { email, password } = registrationRequest;
        const findUserTask  = this.userRepository.findByEmail(Email.create(email));
        return findUserTask.flatMap(maybeExistingUser =>
            maybeExistingUser.fold(
                ()=> this.registerNewUser(email, password),
                () => this.notifyExistingUser()
            )
        );
    }

    private notifyExistingUser() {
        return Either.left<ValidationError, UserRegistrationResponse>(new ValidationError('User already exists with this email.'))
            .toTask();
    }

    private registerNewUser(email: string, password: string) {
        return this.createUserSafe(email, password)
            .toTask()
            .flatMap(user => this.userRepository.save(user)
                .map(u => user.toDto()));
    }

    private createUserSafe(email: string, password: string): Either<ValidationError, User> {
        const id = Id.generateUniqueId();
        const safeEmail = Email.createSafe(email);
        const safePassword = Password.createSafe(password);
        return safeEmail.flatMap(email => safePassword.map(password => new User(id, email, password)));
    }
}

