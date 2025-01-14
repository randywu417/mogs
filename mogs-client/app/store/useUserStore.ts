"use client";

import { decodeJwt } from "jose";
import { create } from "zustand";
import { UserInfo } from "../types";

interface UserStore {
    user?: UserInfo;
    setUser: (user?: UserInfo) => void;
}

const useUserStore = create<UserStore>((set) => ({
    user: undefined,
    setUser: (user?: UserInfo) => set({ user }),
}));

export const initializeUser = (): UserInfo | undefined => {
    const token = localStorage.getItem("token");
    if (!token) {
        return undefined;
    }
    try {
        const decoded = decodeJwt(token) as UserInfo;
        if (!decoded) {
            return undefined;
        }
        const { account, nickname } = decoded;
        return { account, nickname };
    } catch (error) {
        console.error("Failed to decode token:", error);
        return undefined;
    }
};

export default useUserStore;
