import { GameState, SOCKET_EVENT } from "../model/types";

export interface Connection {
    pc: RTCPeerConnection;
    dc: RTCDataChannel;
}
interface OfferOption {
    sender: string;
    offer: RTCSessionDescriptionInit;
}
interface AnswerOption {
    sender: string;
    answer: RTCSessionDescriptionInit;
}
interface CandidateOption {
    sender: string;
    candidate: RTCIceCandidateInit;
}
interface Option {
    initialData: GameState;
    connections: Map<string, Connection>;
    sendSocketMessage: (data: object) => void;
    onMessage: (ev: MessageEvent, from: string) => void;
}
const WebRTC = ({
    initialData,
    connections,
    sendSocketMessage,
    onMessage,
}: Option) => {
    const connectDataChannel = (target: string, connection: Connection) => {
        connection.dc.onopen = () => {
            console.log(`Data channel open with ${target}`);
            // 這裡可以發送資料到對端
            connection.dc.send(JSON.stringify(initialData));
        };

        // 當資料通道有訊息時，處理接收到的資料
        connection.dc.onmessage = (e) => {
            console.log("Received data:", e.data);
        };

        connection.pc.ondatachannel = (event) => {
            console.log("Data channel event:", event.channel);
            const channel = event.channel;
            channel.onmessage = (e) => {
                onMessage(e, target);
            };
        };
    };

    const createConnection = (account: string): Connection => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            iceTransportPolicy: "all",
        });

        // 設置 ICE 候選人收集過程
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("ICE Candidate:", event.candidate);
                sendSocketMessage({
                    type: SOCKET_EVENT.CANDIDATE,
                    target: account,
                    candidate: event.candidate,
                });
            } else {
                console.log("ICE Gathering Complete");
            }
        };

        const dc = pc.createDataChannel("game state");
        return { pc, dc };
    };

    const createPeerConnection = ({ account }: { account: string }) => {
        // 創建 RTCPeerConnection 並指定 ICE 伺服器
        const { pc, dc } = createConnection(account);

        (async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            console.log("Offer created and Local Description set.");
            // 發送 offer 給對方
            sendSocketMessage({
                type: SOCKET_EVENT.OFFER,
                target: account,
                offer,
            });
        })();

        connections.set(account, { pc, dc });

        return pc;
    };

    const closePeerConnection = (account: string) => {
        const connection = connections.get(account);
        if (connection) {
            connection.dc.close();
            connection.pc.close();
            connections.delete(account);
        }
    };

    const handleOffer = async ({ sender, offer }: OfferOption) => {
        const { pc, dc } = createConnection(sender);

        await pc.setRemoteDescription(new RTCSessionDescription(offer)); // 設置遠端描述
        const answer = await pc.createAnswer(); // 創建 answer
        await pc.setLocalDescription(answer); // 設置本地描述

        sendSocketMessage({
            type: SOCKET_EVENT.ANSWER,
            target: sender,
            answer,
        });

        connectDataChannel(sender, { pc, dc });

        connections.set(sender, { pc, dc });
    };

    // 處理對方的 answer
    const handleAnswer = async ({ sender, answer }: AnswerOption) => {
        const connection = connections.get(sender);
        if (connection) {
            await connection.pc.setRemoteDescription(
                new RTCSessionDescription(answer)
            ); // 設置對方的 answer 為遠端描述
            connectDataChannel(sender, connection);
        }
    };

    const handleCandidate = async ({ sender, candidate }: CandidateOption) => {
        const connection = connections.get(sender);
        if (connection) {
            await connection.pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
    };

    const sendMessageToClients = (msg: object): void => {
        for (const [, value] of connections) {
            value.dc.send(JSON.stringify(msg));
        }
    };

    return {
        createPeerConnection,
        closePeerConnection,
        handleOffer,
        handleAnswer,
        handleCandidate,
        sendMessageToClients,
    };
};

export default WebRTC;
