import { Express } from "express";
import { Server } from "ws";
import { LOBBY_PORT } from "../../../configs/project";
import { InitServer } from "../../../types";
import * as DTO from "./dto";

class LobbySocket implements InitServer {
    private static _wss: Server;
    private static _isThrottling = false;

    public initial(app: Express) {
        const server = app.listen(LOBBY_PORT, () => {
            console.log(`Open lobby server at ${LOBBY_PORT} port`);
        });
        LobbySocket._wss = new Server({ server });
        LobbySocket.init_websocket();
    }

    private static init_websocket() {
        LobbySocket._wss.on("connection", (ws, req) => {
            // const query = url.parse(req.url ?? "", true).query;
            // const account = query.account;
            // console.log(`${account} connects to lobby server`);
            ws.send(JSON.stringify(new DTO.UpdateRooms()));

            ws.on("message", (message: any) => {
                const msg = JSON.parse(message.toString());
            });

            ws.on("close", () => {
                // console.log(`${account} disconnected from lobby server`);
            });
        });
    }

    public static send_update_rooms_to_clients() {
        if (LobbySocket._isThrottling) {
            return;
        }
        LobbySocket._isThrottling = true;
        setTimeout(() => {
            const res_msg = new DTO.UpdateRooms();
            LobbySocket.send_all_clients(res_msg);
            LobbySocket._isThrottling = false;
        }, 1000);
    }

    public static send_all_clients(res_msg: DTO.WebSocketMessage) {
        LobbySocket._wss.clients.forEach((client) => {
            client.send(JSON.stringify(res_msg));
        });
    }
}

export default LobbySocket;
