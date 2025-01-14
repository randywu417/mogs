import { colorMap } from "@/app/lobby/model/data";
import { UserInRoom } from "@/app/lobby/model/types";
import { Chatting } from "@/app/room/model/types";
import { Billboard, Html, Text } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";

interface Props {
    user: UserInRoom;
    chat?: Chatting;
    type: "primary" | "secondary";
}
const NameBoard: React.FC<Props> = ({ user, chat, type }) => {
    const chatClass =
        type === "primary"
            ? "text-gray-800 bg-green-300"
            : "text-gray-50 bg-slate-800";
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [chatting, setChatting] = useState<Chatting | null>(null);

    useEffect(() => {
        if (chat?.user.account === user.account) {
            setChatting(chat);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                setChatting(null);
            }, 3500);
        }
    }, [user, chat]);

    return (
        <Billboard position={[0, 200, 0]} follow={true}>
            <Text
                fontWeight={600}
                fontSize={10}
                color={colorMap[user.color]}
                anchorX="center"
                anchorY="middle"
            >
                {user.nickname}
            </Text>
            {chatting && (
                <Html position={[0, 20, 0]} center>
                    <div
                        className={`w-auto max-w-72 px-4 py-2 rounded-md text-left whitespace-pre text-sm -translate-y-1/2 ${chatClass}`}
                    >
                        {decodeURI(chatting.message)}
                    </div>
                </Html>
            )}
        </Billboard>
    );
};

export default NameBoard;
