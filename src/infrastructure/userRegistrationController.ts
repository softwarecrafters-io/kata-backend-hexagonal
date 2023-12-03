import {UserRegistrationService} from "../application/userRegistrationService";
import {ValidationError} from "../core/common/error";
import {UserRegistrationRequest, UserRegistrationResponse} from "../application/dtos";
import {HttpRequest, HttpResponse} from "./http";

export class UserRegistrationController {
    constructor(private userRegistrationService: UserRegistrationService) {}

    register = async (request: HttpRequest<UserRegistrationRequest>, response: HttpResponse<UserRegistrationResponse>): Promise<void> => {
        try {
            this.ensureThatEmailAndPasswordAreProvided(request);
            await this.handleRegistration(request, response);
        } catch (error) {
            this.handleErrors(error, response);
        }
    };

    private ensureThatEmailAndPasswordAreProvided(request: HttpRequest<UserRegistrationRequest>){
        if (!request.body.email || !request.body.password) {
            throw new ValidationError('Email and password are required.');
        }
    }

    private async handleRegistration(request: HttpRequest<UserRegistrationRequest>, response: HttpResponse<UserRegistrationResponse>): Promise<void> {
        const {email, password} = request.body;
        const registrationResponse = await this.userRegistrationService.register({email, password});
        response.status(201).json(registrationResponse);
    }

    private handleErrors(error:Error, response: HttpResponse<UserRegistrationResponse>): void {
        const isValidationError = error instanceof ValidationError;
        isValidationError
            ? response.status(400).json({message: error.message})
            : response.status(500).json({message: 'Internal server error'});
    }

}
