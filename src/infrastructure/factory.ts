import {InMemoryUserRepository, UserRepository} from "../core/repositories/userRepository";
import {UserRegistrationService} from "../application/userRegistrationService";
import {UserRegistrationController} from "./userRegistrationController";
import {createRouter, createServer} from "./server";
import {UserFileRepository} from "./repositories/userFileRepository";
import {Db} from "mongodb";
import {initializeDatabase, UserMongoRepository} from "./repositories/userMongoRepository";

export class Factory{
    private static repository: UserRepository;
    private static db: Db;

    static async initialize(){
        Factory.db = await initializeDatabase('mongodb://localhost:27017', 'mainDB',)
    }

    static getUserRepository(): UserRepository{
        if(!this.repository){
            this.repository = this.createUserMongoRepository();
        }
        return this.repository;
    }

    static createUserMongoRepository(): UserRepository{
        return new UserMongoRepository(this.db);
    }

    static createUserInMemoryRepository(): UserRepository{
        return new InMemoryUserRepository();
    }

    static createUserFileRepository(): UserRepository{
        return UserFileRepository.create('users.json');
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
