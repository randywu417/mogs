"use client";

import { create } from "zustand";

interface SnackStatus {
    status: "success" | "fail" | "";
    message: string;
}
interface SnackStore {
    snackStatus?: SnackStatus;
    setSnackStatus: (snackStatus?: SnackStatus) => void;
}

const useSnackStore = create<SnackStore>((set) => ({
    snackStatus: undefined,
    setSnackStatus: (snackStatus?: SnackStatus) => set({ snackStatus }),
}));

export default useSnackStore;
