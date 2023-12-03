import request from "supertest";
import {Routes} from "../../infrastructure/routes";
import {Factory} from "../../infrastructure/factory";
import {Express} from "express";

describe('The Server', ()=>{
    let server: Express;
    beforeEach(()=>{
        server = Factory.createServer();
    });

    it('works', async ()=>{
        const response = await request(server).get(Routes.status);

        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body).toEqual({status: 'OK'});
    });

    it('registers a new user for a given valid credentials', async ()=>{
        const email = 'test@test.es';
        const password = 'TestPass123_';
        const response = await request(server).post(Routes.register).send({email, password});

        expect(response.status).toEqual(201);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body).toEqual({
            id: expect.any(String),
            email: email
        });
    });

    it('rejects registration with an already taken email', async () => {
        const email = 'test@test.es';
        const password = 'TestPass123_';
        await request(server).post(Routes.register).send({ email, password });
        const response = await request(server).post(Routes.register).send({ email, password });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            message: 'User already exists with this email.'
        });
    });

    it('rejects registration with missing email or password', async () => {
        const response = await request(server).post(Routes.register).send({ email: '', password: '' });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            message: 'Email and password are required.'
        });
    });

    it('rejects registration with invalid email', async () => {
        const response = await request(server).post(Routes.register).send({ email: 'test', password: 'TestPass123_' });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            message: 'Invalid email format'
        });
    });

    it('rejects registration with invalid password', async () => {
        const response = await request(server).post(Routes.register).send({ email: 'another@test.es', password: 'test' });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            message: 'Password is too short, Password must contain a number, Password must contain an uppercase letter, Password must contain an underscore'
        });
    });
});
