import {Factory} from "./infrastructure/factory";

const server = Factory.createServer();
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${ PORT }`));
