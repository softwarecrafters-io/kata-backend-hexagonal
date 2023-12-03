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
        const existingUser = await this.userRepository.findByEmail(Email.create(email));
        if (existingUser) {
            throw new ValidationError('User already exists with this email.');
        }
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
