"use client";

import { Snackbar as MUISnackbar } from "@mui/material";
import React from "react";
import useSnackStore from "../store/useSnackStore";

const Snackbar: React.FC = () => {
    const { snackStatus, setSnackStatus } = useSnackStore();

    const getSnackColor = (): string => {
        switch (snackStatus?.status) {
            case "success":
                return "bg-green-500";
            case "fail":
                return "bg-red-500";
            default:
                return "";
        }
    };

    return (
        <MUISnackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackStatus !== undefined}
            onClose={() => {
                setSnackStatus(undefined);
            }}
            autoHideDuration={3000}
        >
            <div
                className={`p-2 px-6 rounded-md text-white text-lg ${getSnackColor()}`}
            >
                {snackStatus?.message}
            </div>
        </MUISnackbar>
    );
};

export default Snackbar;
