export interface UserRegistrationRequest {
    email: string;
    password: string;
}

export type UserRegistrationResponse = {
    id: string;
    email: string;
}
