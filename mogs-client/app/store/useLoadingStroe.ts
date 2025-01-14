"use client";

import { create } from "zustand";

interface LoadingStore {
    loading: string | boolean;
    setLoading: (loading: string | boolean) => void;
}

const useLoadingStore = create<LoadingStore>((set) => ({
    loading: false,
    setLoading: (loading: string | boolean) => set({ loading }),
}));

export default useLoadingStore;
