"use client";

import useUserStore from "@/app/store/useUserStore";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useMemo, useState } from "react";
import { UserInfo } from "../../types";
import ExitButton from "../components/ExitButton";
import Instructions from "../components/Instructions";
import Messages from "../components/Messages";
import PlayerList from "../components/PlayerList";
import RoomPeople from "../components/RoomPeople";
import Scene from "../components/Scene";
import { Players } from "../components/Scene/types";
import Sender from "../components/Sender";
import useRoom from "../components/useRoom";
import { Chatting } from "../model/types";
import { isChatting } from "../utils";

interface Props {
    roomId: string;
}

const Room: React.FC<Props & { user: UserInfo }> = ({ user, roomId }) => {
    const [isMessaging, setIsMessaging] = useState(false);
    const [lastChatting, setLastChatting] = useState<Chatting>();
    const { info, messages, onlineStatus, gameState, send } = useRoom({
        account: user.account,
        roomId,
    });

    const players = useMemo<Players>(() => {
        const players: Players = new Array(0);
        for (const [account, state] of gameState) {
            const user = info?.users.find((u) => u.account === account);
            if (user) {
                players.push([account, { user, state }]);
            }
        }
        return players;
    }, [info?.users, gameState]);

    const userInRoom = useMemo(() => {
        return info?.users.find((u) => u.account === user.account);
    }, [info?.users, user]);

    useEffect(() => {
        const lastChatting = messages.findLast(isChatting);
        setLastChatting(lastChatting);
    }, [messages]);

    if (!info) {
        return null;
    }

    return (
        <div className="fixed w-screen h-screen p-8 grid grid-rows-[37px_220px_1fr_92px] grid-cols-[220px_1fr_auto] gap-4">
            <div className="col-span-1 h-full flex flex-col justify-end z-10">
                <div className="w-full h-full">
                    <ExitButton user={user} roomId={roomId} />
                </div>
            </div>
            <div className="col-span-1 flex flex-row justify-start items-center z-10">
                <div className="text-2xl font-medium text-hide text-white">
                    {info.name}
                </div>
            </div>
            <div className="col-span-1 z-10 text-white">
                <RoomPeople
                    isHost={info.host.account === user.account}
                    roomId={roomId}
                    curPeople={info.users.length}
                    maxPeople={info.maxPeople}
                />
            </div>
            <div className="col-span-1 row-span-1 flex flex-col h-full w-full z-10">
                <div className="text-xl font-medium text-hide min-h-8 text-white">
                    Players:
                </div>
                <PlayerList
                    host={info.host}
                    users={info.users}
                    onlineStatus={onlineStatus}
                />
            </div>
            <div className="col-span-2 row-span-2 pointer-events-none" />
            <div className="col-span-1 row-span-2 flex flex-col h-full w-full z-10">
                <div className="text-xl font-medium text-hide min-h-8 text-white">
                    Messages:
                </div>
                <Messages user={user} users={info.users} messages={messages} />
            </div>
            <div className="col-span-2 rounded-md flex flex-col justify-end z-10">
                <Sender
                    roomId={roomId}
                    user={user}
                    isMessaging={isMessaging}
                    setIsMessaging={setIsMessaging}
                />
            </div>
            <div className="absolute w-screen h-screen z-0">
                <Canvas
                    shadows
                    onPointerDown={(e) => {
                        if (e.pointerType === "mouse") {
                            (e.target as HTMLElement).requestPointerLock();
                        }
                    }}
                >
                    <Scene
                        user={userInRoom}
                        players={players}
                        lastChatting={lastChatting}
                        disableControl={isMessaging}
                        send={send}
                    />
                </Canvas>
                <Instructions />
            </div>
        </div>
    );
};

const ClientRoom: React.FC<Props> = ({ roomId }) => {
    const { user } = useUserStore();

    if (!user) {
        return <></>;
    }

    return <Room user={user} roomId={roomId} />;
};

export default ClientRoom;
