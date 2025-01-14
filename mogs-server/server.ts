import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import cors_option from "./src/configs/cors_option";
import HttpServer from "./src/framework/http";
import LobbySocket from "./src/framework/websocket/lobby";
import RoomSocket from "./src/framework/websocket/room";

const app = express();

app.use(cors(cors_option));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

new HttpServer().initial(app);
new LobbySocket().initial(app);
new RoomSocket().initial(app);

export default app;
