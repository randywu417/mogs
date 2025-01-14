import { Express } from "express";
import { HTTP_PORT } from "../../configs/project";
import { InitServer } from "../../types";
import api from "./api";
import middleware from "./api/middleware";

class HttpServer implements InitServer {
    public initial(app: Express) {
        app.post("/api/sign/signin", api.sign.signin);
        app.post("/api/sign/signup", api.sign.signup);

        app.post("/api/lobby/checkRoom", middleware, api.lobby.checkRoom);
        app.post("/api/lobby/create", middleware, api.lobby.create);
        app.post("/api/lobby/join", middleware, api.lobby.join);
        app.get("/api/lobby/roomDetails", middleware, api.lobby.roomDetails);
        app.get("/api/lobby/getRooms", middleware, api.lobby.getRooms);
        app.get("/api/lobby/search", middleware, api.lobby.search);

        app.get("/api/room/info", middleware, api.room.info);
        app.post("/api/room/exit", middleware, api.room.exit);
        app.post("/api/room/changePeople", middleware, api.room.changePeople);
        app.post("/api/room/chatting", middleware, api.room.chatting);

        app.listen(HTTP_PORT, () => {
            console.log(`Open http server at ${HTTP_PORT} port`);
        });
    }
}

export default HttpServer;
