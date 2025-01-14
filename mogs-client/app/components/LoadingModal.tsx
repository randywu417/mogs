"use client";

import { Modal } from "@mui/material";
import React from "react";
import useLoadingStore from "../store/useLoadingStroe";

const LoadingModal: React.FC = () => {
    const { loading } = useLoadingStore();

    return (
        <Modal open={Boolean(loading)}>
            <div className="modalFrame h-auto w-[280px]">
                <div className="flex flex-row justify-center items-center">
                    {typeof loading === "string" ? loading : "Loading..."}
                </div>
            </div>
        </Modal>
    );
};

export default LoadingModal;
