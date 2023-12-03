import {InMemoryUserRepository, UserRepository} from "../core/repositories/userRepository";
import {UserRegistrationService} from "../application/userRegistrationService";
import {UserRegistrationController} from "./userRegistrationController";
import {createRouter, createServer} from "./server";

export class Factory{
    private static repository: UserRepository;
    static getUserRepository(): UserRepository{
        if(!this.repository){
            this.repository = new InMemoryUserRepository();
        }
        return this.repository;
    }

    static createUserRegistrationService(): UserRegistrationService{
        return new UserRegistrationService(this.getUserRepository());
    }

    static createUserController(): UserRegistrationController{
        return new UserRegistrationController(this.createUserRegistrationService());
    }

    static createServer(){
        const router = createRouter(this.createUserController());
        return createServer(router);
    }
}
