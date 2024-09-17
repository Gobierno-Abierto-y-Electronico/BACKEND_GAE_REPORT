import { config } from "dotenv";
config()
import Server from "./config/server.js";
const server = new Server()
server.listen()