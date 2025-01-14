import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { AnimationAction, AnimationMixer, Group } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export enum ACTION {
    IDLE = "idle",
    WAVE = "wave",
    DANCE = "dance",
    WALK = "walk",
    SIT = "sit",
}

const useApplyModels = ({ currentAction }: { currentAction: string }) => {
    const groupRef = useRef<Group>(null);
    const actionsRef = useRef<Map<string, AnimationAction>>(new Map());
    const mixerRef = useRef<AnimationMixer | null>(null);

    useEffect(() => {
        const loader = new FBXLoader();

        loader.load(
            "/models/character.fbx",
            async (fbx) => {
                mixerRef.current = new AnimationMixer(fbx);

                const loadAnimation = (name: string): Promise<Group> =>
                    new Promise((resolve) => {
                        loader.load(`/models/${name}.fbx`, resolve);
                    });

                const nameList = [
                    ACTION.IDLE,
                    ACTION.WALK,
                    ACTION.WAVE,
                    ACTION.DANCE,
                    ACTION.SIT,
                ];
                for (const name of nameList) {
                    const animation = await loadAnimation(name);
                    const action = mixerRef.current?.clipAction(
                        animation.animations[0]
                    );
                    if (action) {
                        actionsRef.current.set(name, action);
                        if (name === ACTION.IDLE) {
                            action.play();
                        }
                    }
                }

                groupRef.current?.add(fbx);
            },
            undefined,
            (error) => {
                console.error("Error loading model:", error);
            }
        );
    }, [groupRef]);

    useEffect(() => {
        const animation = actionsRef.current.get(currentAction);
        if (mixerRef.current && animation) {
            for (const [key, action] of actionsRef.current) {
                if (
                    (key === ACTION.WALK && currentAction === ACTION.IDLE) ||
                    (key === ACTION.IDLE && currentAction === ACTION.WALK)
                ) {
                    action.crossFadeTo(animation, 1, true);
                } else {
                    action.crossFadeTo(animation, 0, false);
                }
            }
            animation.timeScale = 1;
            animation.reset().play();
        }
    }, [currentAction]);

    useFrame((_, delta) => {
        if (mixerRef.current) {
            mixerRef.current.update(delta);
        }
    });

    return { groupRef };
};

export default useApplyModels;
