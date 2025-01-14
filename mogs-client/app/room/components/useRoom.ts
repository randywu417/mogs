import useWebSocket from "@/app/hooks/useWebSocket";
import { RoomDetails } from "@/app/lobby/model/types";
import { ROUTE } from "@/app/model/routes";
import useLoadingStore from "@/app/store/useLoadingStroe";
import { ROOM_PORT } from "@/app/types";
import parseErrorResponse from "@/app/utils/parseErrorResponse";
import { convertToSearchParams } from "@/app/utils/searchParams";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    Chatting,
    GameState,
    Notify,
    OnlineList,
    SOCKET_EVENT,
} from "../model/types";
import { fetchGetRoom } from "../service/api";
import { ACTION } from "./Scene/types";
import WebRTC, { Connection } from "./WebRTC";

type RoomInfo = RoomDetails | null | undefined;
interface RoomOption {
    account: string;
    roomId: string;
}
const useRoom = ({ account, roomId }: RoomOption) => {
    const router = useRouter();
    const { setLoading } = useLoadingStore();
    const [roomInfo, setRoomInfo] = useState<RoomInfo>();
    const [onlineStatus, setOnlineStatus] = useState(new Map());
    const socketParams = useMemo(() => {
        return convertToSearchParams({ account, roomId });
    }, [account, roomId]);
    const [messages, setMessages] = useState<Array<Chatting | Notify>>([
        {
            message: `${account} is joined`,
            messageId: uuidv4(),
            time: Date.now(),
        },
    ]);
    const [gameState, setGameState] = useState(new Map());

    const connections = useRef(new Map<string, Connection>());
    const rtcSender = useRef<((msg: object) => void) | null>(null);
    const myStateRef = useRef({
        action: ACTION.IDLE,
        position: { x: 0, y: 0, z: 0 },
        quaternion: { x: 0, y: 0, z: 0, w: 1 },
        timestamp: 0,
    });

    const rtcMessage = useCallback((e: MessageEvent, from: string) => {
        const data: GameState = JSON.parse(e.data);
        console.log(`Received data from ${from}: `, data);
        setGameState((prev) => {
            const prevStatus = prev.get(from);
            if (prevStatus && data.timestamp < prevStatus.timestamp) {
                return prev;
            }
            prev.set(from, data);
            return new Map(prev);
        });
    }, []);

    const onSocketOpen = useCallback(async (send: (data: object) => void) => {
        send({ type: SOCKET_EVENT.JOIN });
    }, []);

    const onSocketMessage = useCallback(
        async (e: MessageEvent, send: (data: object) => void) => {
            const msg = JSON.parse(e.data);
            const type: SOCKET_EVENT = msg.type;

            console.log(["receive"], msg);

            const rtc = WebRTC({
                initialData: myStateRef.current,
                connections: connections.current,
                sendSocketMessage: send,
                onMessage: rtcMessage,
            });
            rtcSender.current = rtc.sendMessageToClients;

            const handler = {
                [SOCKET_EVENT.UPDATE_ROOM]: async () => {
                    const errorCallback = (): void => {
                        router.push(ROUTE.LOBBY);
                    };
                    await fetchGetRoom(account, roomId)
                        .then(({ data }) => setRoomInfo(data))
                        .catch(parseErrorResponse({ callback: errorCallback }));
                },
                [SOCKET_EVENT.UPDATE_STATUS]: () => {
                    const onlineList: OnlineList = msg.onlineList;
                    const map = new Map<string, boolean>();
                    onlineList.forEach((a) => map.set(a.account, a.online));
                    setOnlineStatus(map);
                },
                [SOCKET_EVENT.CHATTING]: () => {
                    setMessages((prev) => [...prev, msg.chatting]);
                },
                [SOCKET_EVENT.NOTIFY]: () => {
                    setMessages((prev) => [...prev, msg.notify]);
                },
                [SOCKET_EVENT.JOIN]: () => {
                    if (account === msg.account) {
                        setLoading(false);
                    } else {
                        rtc.createPeerConnection(msg);
                    }
                },
                [SOCKET_EVENT.OFFER]: () => {
                    rtc.handleOffer(msg);
                },
                [SOCKET_EVENT.ANSWER]: () => {
                    rtc.handleAnswer(msg);
                },
                [SOCKET_EVENT.CANDIDATE]: () => {
                    rtc.handleCandidate(msg);
                },
                [SOCKET_EVENT.EXIT]: () => {
                    const { exited } = msg;
                    setGameState((prev) => {
                        prev.delete(exited);
                        return new Map(prev);
                    });
                    rtc.closePeerConnection(exited);
                },
            } as const;

            await handler[type]();
        },
        [router, account, roomId, rtcMessage, setLoading]
    );

    useWebSocket({
        params: socketParams,
        port: ROOM_PORT,
        onOpen: onSocketOpen,
        onMessage: onSocketMessage,
    });

    return {
        info: roomInfo,
        messages,
        onlineStatus,
        gameState,
        send: (data: GameState) => {
            myStateRef.current = data;
            if (rtcSender.current) {
                console.log(["send"], data);
                rtcSender.current(data);
            } else {
                console.error("rtc send failed");
            }
        },
    };
};

export default useRoom;
