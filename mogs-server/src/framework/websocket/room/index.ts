import { Express } from "express";
import url from "url";
import WebSocket, { Server } from "ws";
import { ROOM_PORT } from "../../../configs/project";
import { roomDB } from "../../../db/room";
import { Chatting, InitServer, Notify } from "../../../types";
import * as DTO from "./dto";
import { CLIENT_EVENT_TYPE } from "./types";

interface UserWS {
    account: string;
    ws: WebSocket;
}
class RoomSocket implements InitServer {
    private static _wss: Server;

    private static ws_map = new Map<string, Array<UserWS>>();

    public initial(app: Express) {
        const server = app.listen(ROOM_PORT, () => {
            console.log(`Open room server at ${ROOM_PORT} port`);
        });
        RoomSocket._wss = new Server({ server });
        RoomSocket.init_websocket();
    }

    private static init_websocket() {
        RoomSocket._wss.on("connection", (ws, req) => {
            const query = url.parse(req.url ?? "", true).query;
            const roomId = query.roomId as string;
            const account = query.account as string;
            // console.log(`${account} connects to room server`);
            if (!roomId) {
                return;
            }
            const wss = RoomSocket.ws_map.get(roomId) ?? [];
            RoomSocket.ws_map.set(roomId, [...wss, { account, ws }]);

            const res_msg = new DTO.UpdateRoom();
            ws.send(JSON.stringify(res_msg));

            RoomSocket.send_online_status_to_clients(roomId);
            RoomSocket.send_update_room_to_clients(roomId);

            ws.on("message", (message: any) => {
                const data = JSON.parse(message.toString());
                const type: CLIENT_EVENT_TYPE = data.type;

                const wss = RoomSocket.ws_map.get(roomId);
                if (!wss || !wss.length) {
                    return;
                }
                if (type === CLIENT_EVENT_TYPE.JOIN) {
                    const res_msg = new DTO.JoinedAccount(account);
                    RoomSocket.send_to_all_clients(res_msg, wss);
                } else if (
                    type === CLIENT_EVENT_TYPE.OFFER ||
                    type === CLIENT_EVENT_TYPE.ANSWER ||
                    type === CLIENT_EVENT_TYPE.CANDIDATE
                ) {
                    const { target } = data;
                    const found = wss.find(
                        (c) => c.account === target && target !== account
                    );
                    if (!found) {
                        return;
                    }
                    found.ws.send(JSON.stringify({ ...data, sender: account }));
                }
            });
            ws.on("close", () => {
                // console.log(`${account} disconnected from room server`);
                RoomSocket.handle_close_socket(account, roomId);
            });
        });
    }

    public static send_exit_user_to_clients = (
        roomId: string,
        exited: string
    ) => {
        const wss = RoomSocket.ws_map.get(roomId);
        if (!wss || !wss.length) {
            return;
        }
        const clients = wss.filter((c) => c.account !== exited);
        const res = new DTO.ExitedMessage(exited);
        RoomSocket.send_to_all_clients(res, clients);
    };

    public static send_online_status_to_clients = (roomId: string) => {
        const wss = RoomSocket.ws_map.get(roomId);
        const room = roomDB.get(roomId);
        if (!wss || !wss.length || !room) {
            return;
        }
        const onlineList = room.users.map((user) => {
            const found = wss.find((w) => w.account === user.account);
            return { account: user.account, online: Boolean(found) };
        });
        const res_msg = new DTO.UpdateOnlineStatus(onlineList);
        RoomSocket.send_to_all_clients(res_msg, wss);
    };

    public static send_update_room_to_clients(roomId: string) {
        const room = roomDB.get(roomId);
        const wss = RoomSocket.ws_map.get(roomId);
        if (!wss || !wss.length || !room) {
            return;
        }
        const res_msg = new DTO.UpdateRoom();
        wss.forEach((client) => {
            const found = room.users.find((u) => u.account === client.account);
            if (found) {
                client.ws.send(JSON.stringify(res_msg));
            }
        });
    }

    public static send_chatting_msg_to_clients(
        roomId: string,
        chatting: Chatting
    ) {
        const wss = RoomSocket.ws_map.get(roomId);
        if (!wss || !wss.length) {
            return;
        }
        const res_msg = new DTO.ChattingMessage(chatting);
        RoomSocket.send_to_all_clients(res_msg, wss);
    }

    public static send_system_msg_to_clients(roomId: string, notify: Notify) {
        const wss = RoomSocket.ws_map.get(roomId);
        if (!wss || !wss.length) {
            return;
        }
        const res_msg = new DTO.SystemNotify(notify);
        RoomSocket.send_to_all_clients(res_msg, wss);
    }

    private static handle_close_socket(account: string, roomId: string) {
        if (!roomId) {
            return;
        }
        const wss = RoomSocket.ws_map.get(roomId);
        const room = roomDB.get(roomId);
        if (!wss || !room) {
            RoomSocket.ws_map.delete(roomId);
            return;
        }
        const wss_index = wss.findIndex((ws) => ws.account === account);
        if (wss_index >= 0) {
            wss[wss_index].ws.close();
            wss.splice(wss_index, 1);
            RoomSocket.send_online_status_to_clients(roomId);
        }
    }

    public static send_to_all_clients(
        res_msg: DTO.WebSocketMessage,
        clients: Array<UserWS>
    ) {
        clients.forEach((client) => {
            client.ws.send(JSON.stringify(res_msg));
        });
    }
}

export default RoomSocket;
