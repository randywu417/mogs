import { UserInRoom } from "@/app/lobby/model/types";
import { Chatting, GameState } from "@/app/room/model/types";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { ACTION } from "../types";
import NameBoard from "./NameBoard";
import useApplyModels from "./useApplyModels";

interface Props {
    user: UserInRoom;
    status: GameState;
    chat?: Chatting;
}
const PlayerCharacter: React.FC<Props> = ({ user, status, chat }) => {
    const [currentAction, setCurrentAction] = useState<ACTION>(status.action);
    const { groupRef } = useApplyModels({ currentAction });
    const timestampRef = useRef<number>(0);

    useFrame(() => {
        const node = groupRef.current;
        if (!user || !node || status.timestamp < timestampRef.current) {
            return;
        }
        const { action, position: p, quaternion: q, timestamp } = status;

        setCurrentAction(action);

        const targetPosition = new THREE.Vector3(p.x, p.y, p.z);
        const targetQuaternion = new THREE.Quaternion(q.x, q.y, q.z, q.w);

        node.position.lerp(targetPosition, 0.1);
        node.quaternion.slerp(targetQuaternion, 0.1);

        timestampRef.current = timestamp;
    });

    return (
        <group ref={groupRef} scale={[0.02, 0.02, 0.02]}>
            <NameBoard type="secondary" user={user} chat={chat} />
        </group>
    );
};

export default PlayerCharacter;
