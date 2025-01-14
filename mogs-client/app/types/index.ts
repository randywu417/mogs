export const DOMAIN = "http://localhost:";
export const WS_DOMAIN = "ws://localhost:";
export const HTTP_PORT = 8080;
export const LOBBY_PORT = 6041;
export const ROOM_PORT = 7041;

export interface SignUpForm {
    nickname: string;
    account: string;
    password: string;
    confirmPassword: string;
}

export interface SignInForm {
    account: string;
    password: string;
}

export interface UserInfo {
    nickname: string;
    account: string;
}

export enum ROOM_STATE {
    OPEN = "OPEN",
    FULL = "FULL",
    LOCK = "LOCKED",
}
export enum COLOR {
    RED = 1,
    ORANGE,
    CORAL,
    GOLD,
    YELLOW,
    AMBER,
    LIME,
    GREEN,
    EMERALD,
    OLIVE,
    TEAL,
    CYAN,
    SKY,
    BLUE,
    INDIGO,
    NAVY,
    PURPLE,
    VIOLET,
    MAGENTA,
    PINK,
    CRIMSON,
    MAROON,
    BROWN,
    SILVER,
}
