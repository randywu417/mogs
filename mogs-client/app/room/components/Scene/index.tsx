import { UserInRoom } from "@/app/lobby/model/types";
import { Environment } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import React from "react";
import { Chatting, GameState } from "../../model/types";
import ControllableCharacter from "./components/ControllableCharacter";
import PlayerCharacter from "./components/PlayerCharacter";
import { Players } from "./types";

interface Props {
    user?: UserInRoom;
    players: Players;
    lastChatting?: Chatting;
    disableControl: boolean;
    send: (status: GameState) => void;
}
const Scene: React.FC<Props> = ({
    user,
    players,
    lastChatting,
    disableControl,
    send,
}) => {
    const filterPlayerChat = (account: string): Chatting | undefined => {
        if (lastChatting?.user.account !== account) {
            return;
        }
        return lastChatting;
    };

    return (
        <>
            <Environment preset="night" ground={{ scale: 100 }} />
            <directionalLight
                intensity={3.2}
                color={"#ffffed"}
                position={[0, 20, -20]}
            />
            <ambientLight intensity={2} />

            {players.map(([account, info]) => (
                <PlayerCharacter
                    key={account}
                    user={info.user}
                    status={info.state}
                    chat={filterPlayerChat(account)}
                />
            ))}

            <Physics colliders="hull">
                <ControllableCharacter
                    user={user}
                    chat={filterPlayerChat(user?.account ?? "")}
                    disableControl={disableControl}
                    send={send}
                />
                <RigidBody type="fixed" colliders="trimesh">
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                        <planeGeometry args={[5000, 5000]} />
                        <meshStandardMaterial color="black" />
                    </mesh>
                </RigidBody>
            </Physics>
        </>
    );
};

export default Scene;
