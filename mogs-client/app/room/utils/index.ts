import { Chatting, Notify } from "../model/types";

export const isChatting = (data: Chatting | Notify): data is Chatting => {
    return "user" in data;
};

export const isSameUser = (
    arr: Array<Chatting | Notify>,
    index: number
): boolean => {
    if (index === 0) {
        return false;
    }
    const prev = arr[index - 1];
    const curr = arr[index];
    if (!isChatting(prev) || !isChatting(curr)) {
        return false;
    }
    return prev.user.account === curr.user.account;
};
