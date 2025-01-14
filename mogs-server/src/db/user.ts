interface UserAccount {
    nickname: string;
    account: string;
    password: string;
}

export const userDB: Map<string, UserAccount> = new Map();

/**
 * key: account, value: roomDB
 */
export const joinRoomDB: Map<string, string> = new Map();
