import useLoadingStore from "@/app/store/useLoadingStroe";
import { COLOR, UserInfo } from "@/app/types";
import parseErrorResponse from "@/app/utils/parseErrorResponse";
import { Button, Modal, ModalProps } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { colorMap, colors } from "../model/data";
import { JoinRoomInfo, RoomDetails } from "../model/types";
import { fetchRoomDetails } from "../service/api";

interface Props extends Omit<ModalProps, "open" | "children"> {
    user: UserInfo;
    roomId: string;
    onJoin: (info: JoinRoomInfo) => void;
    onClose: () => void;
}

const Room: React.FC<Props & { roomDetails: RoomDetails }> = ({
    user,
    onJoin,
    onClose,
    roomDetails: { name, id, users, maxPeople },
}) => {
    const { loading, setLoading } = useLoadingStore();
    const { watch, setValue, handleSubmit } = useForm<JoinRoomInfo>({
        defaultValues: {
            roomId: id,
            user: user,
            color: COLOR.RED,
        },
    });
    const color = watch("color");

    const onSubmit = async (form: JoinRoomInfo): Promise<void> => {
        setLoading(true);
        try {
            await onJoin(form);
        } catch {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-row justify-between items-center">
                <div className="text-xl font-bold text-hide">{name}</div>
                <div>{id}</div>
            </div>
            <div className="flex flex-col items-start gap-4">
                <div className="text-xl font-bold text-hide">
                    Players: {users.length + " / " + maxPeople}
                </div>
                <ul className="w-full h-[80px] border border-slate-300 overflow-auto p-1 px-2 rounded-md">
                    {users.map((user) => (
                        <li
                            key={user.account}
                            className="text-hide"
                            style={{ color: colorMap[user.color] }}
                        >
                            {user.nickname} ({user.account})
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-2">
                <div className="mb-2">Your Color: </div>
                <div className="flex flex-row flex-wrap items-center justify-between gap-4 h-20 overflow-auto">
                    {colors.map((c) => (
                        <button
                            key={c}
                            className={`w-10 h-10 rounded-full border-2 border-solid transition-all ${
                                color === c
                                    ? "border-slate-600 opacity-100"
                                    : "border-white opacity-30"
                            }`}
                            style={{ backgroundColor: colorMap[c] }}
                            onClick={() => setValue("color", c)}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-row justify-between gap-8">
                <Button onClick={onClose} variant="outlined" className="w-28">
                    Close
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    className="w-28"
                    disabled={Boolean(loading) || users.length >= maxPeople}
                >
                    Join
                </Button>
            </div>
        </>
    );
};

const EnterModal: React.FC<Props> = ({
    user,
    roomId,
    onJoin,
    onClose,
    ...props
}) => {
    const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);

    const handleClose = useCallback((): void => {
        onClose();
        setRoomDetails(null);
    }, [onClose]);

    const initRoomDetails = useCallback(async () => {
        if (!roomId) {
            return;
        }
        await fetchRoomDetails(roomId)
            .then((res) => setRoomDetails(res.data))
            .catch(parseErrorResponse({ callback: handleClose }));
    }, [roomId, handleClose]);

    useEffect(() => {
        initRoomDetails();
    }, [initRoomDetails]);

    return (
        <Modal
            {...props}
            open={roomId !== ""}
            slotProps={{ backdrop: { transitionDuration: 0 } }}
            onClose={handleClose}
        >
            <div className="h-[430px] w-[400px] modalFrame">
                {roomDetails ? (
                    <Room
                        user={user}
                        roomId={roomId}
                        onClose={handleClose}
                        onJoin={onJoin}
                        roomDetails={roomDetails}
                    />
                ) : (
                    <div className="w-full h-full flex flex-row justify-center items-center">
                        Loading...
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EnterModal;
