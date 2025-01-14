import { UserInRoom } from "@/app/lobby/model/types";
import { GameState } from "@/app/room/model/types";

export type Player = [string, { user: UserInRoom; state: GameState }];
export type Players = Array<Player>;

export enum ACTION {
    IDLE = "idle",
    WAVE = "wave",
    DANCE = "dance",
    WALK = "walk",
    SIT = "sit",
}
