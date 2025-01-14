import { UserInRoom } from "@/app/lobby/model/types";
import { Chatting, GameState } from "@/app/room/model/types";
import { KeyboardControls } from "@react-three/drei";
import Ecctrl from "ecctrl";
import React, { useMemo, useState } from "react";
import NameBoard from "./NameBoard";
import useApplyModels, { ACTION } from "./useApplyModels";

enum Controls {
    forward = "forward",
    backward = "backward",
    leftward = "leftward",
    rightward = "rightward",
    action1 = "action1",
    action2 = "action2",
    action3 = "action3",
}

const keyboardMap = [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.leftward, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.rightward, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.action1, keys: ["1"] },
    { name: Controls.action2, keys: ["2"] },
    { name: Controls.action3, keys: ["3"] },
];

interface Props {
    user?: UserInRoom;
    chat?: Chatting;
    disableControl: boolean;
    send: (status: GameState) => void;
}
const ControllableCharacter: React.FC<Props> = ({
    user,
    chat,
    disableControl,
    send,
}) => {
    const [currentAction, setCurrentAction] = useState<ACTION>(ACTION.IDLE);
    const { groupRef } = useApplyModels({ currentAction });
    const map = useMemo(() => {
        return disableControl ? [] : keyboardMap;
    }, [disableControl]);

    const handleKeyboard = (
        name: string,
        _: boolean,
        state: { [key: string]: boolean }
    ) => {
        const getAction = (): ACTION => {
            const isWalking = [
                state.forward,
                state.backward,
                state.leftward,
                state.rightward,
            ].some(Boolean);

            if (isWalking) {
                return ACTION.WALK;
            } else if (name === "action1") {
                return ACTION.WAVE;
            } else if (name === "action2") {
                return ACTION.DANCE;
            } else if (name === "action3") {
                return ACTION.SIT;
            } else {
                return ACTION.IDLE;
            }
        };
        const node = groupRef.current?.parent?.parent;
        if (node) {
            const action = getAction();
            setCurrentAction(action);
            const [px, py, pz] = node.position.toArray();
            const [qx, qy, qz, qw] = node.quaternion.toJSON();
            const status: GameState = {
                action: action,
                position: { x: px, y: py, z: pz },
                quaternion: { x: qx, y: qy, z: qz, w: qw },
                timestamp: Date.now(),
            };
            send(status);
        }
    };

    return (
        <KeyboardControls map={map} onChange={handleKeyboard}>
            <Ecctrl
                camTargetPos={{ x: 0, y: 3.2, z: -1 }}
                camLerpMult={50}
                lockRotations={disableControl}
                lockTranslations={disableControl}
            >
                <group ref={groupRef} scale={[0.02, 0.02, 0.02]}>
                    {user && (
                        <NameBoard type="primary" user={user} chat={chat} />
                    )}
                </group>
            </Ecctrl>
        </KeyboardControls>
    );
};

export default ControllableCharacter;
