import {UserRepository} from "../core/repositories/userRepository";
import {UserRegistrationRequest, UserRegistrationResponse} from "./dtos";
import {Email} from "../core/valueObjects/email";
import {Id} from "../core/valueObjects/id";
import {User} from "../core/entities/user";
import {Password} from "../core/valueObjects/password";
import {ValidationError} from "../core/common/error";

export class UserRegistrationService {
    constructor(private userRepository: UserRepository) {}

    async register(registrationRequest: UserRegistrationRequest): Promise<UserRegistrationResponse> {
        const { email, password } = registrationRequest;
        const maybeExistingUser = await this.userRepository.findByEmail(Email.create(email));
        maybeExistingUser.tap(()=> {
            throw new ValidationError('User already exists with this email.')
        });
        const id = Id.generateUniqueId();
        const user = this.createUser(id, email, password);
        await this.userRepository.save(user);
        return {
            id: id.toString(),
            email
        };
    }

    private createUser(id: Id, email: string, password: string) {
        const user = new User(
            id,
            Email.create(email),
            Password.createFromPlainText(password)
        );
        return user;
    }
}
