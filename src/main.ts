import {Factory} from "./infrastructure/factory";

Factory.initialize().then(()=>{
    const server = Factory.createServer();
    const PORT = 3000;
    server.listen(PORT, () => console.log(`Server running on port ${ PORT }`));
});
