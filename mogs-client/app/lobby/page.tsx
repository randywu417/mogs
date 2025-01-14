"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ROUTE } from "../model/routes";
import useLoadingStore from "../store/useLoadingStroe";
import useSnackStore from "../store/useSnackStore";
import useUserStore from "../store/useUserStore";
import parseErrorResponse from "../utils/parseErrorResponse";
import CreateModal from "./components/CreateModal";
import EnterModal from "./components/EnterModal";
import RoomTable from "./components/RoomTable";
import SearchModal from "./components/SearchModal";
import { CreateRoomForm, JoinRoomInfo } from "./model/types";
import {
    fetchCheckRoom,
    fetchCreateRoom,
    fetchJoinRoom,
    fetchSearchRoomById,
} from "./service/api";

const Lobby: React.FC = () => {
    const router = useRouter();
    const [openEnterRoomId, setOpenEnterRoomId] = useState("");
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const { user, setUser } = useUserStore();
    const { setSnackStatus } = useSnackStore();
    const { setLoading } = useLoadingStore();

    const closeEnterModal = useCallback(() => setOpenEnterRoomId(""), []);
    const closeCreateModal = useCallback(() => setOpenCreateModal(false), []);
    const closeSearchModal = useCallback(() => setOpenSearchModal(false), []);

    const handleJoinRoom = async (info: JoinRoomInfo): Promise<void> => {
        await fetchJoinRoom(info)
            .then(() => {
                router.push(ROUTE.ROOM + info.roomId);
                setSnackStatus({
                    status: "success",
                    message: "Join room successfully",
                });
            })
            .catch(parseErrorResponse());
    };

    const handleCreateRoom = async (info: CreateRoomForm): Promise<void> => {
        await fetchCreateRoom(info)
            .then((response) => {
                const res = response.data;
                router.push(ROUTE.ROOM + res.roomId);
                setSnackStatus({
                    status: "success",
                    message: "Create room successfully",
                });
            })
            .catch(parseErrorResponse());
    };

    const handleSearchRoom = async (id: string): Promise<void> => {
        setLoading(true);

        await fetchSearchRoomById(id)
            .then((response) => {
                const { exist } = response.data;
                if (exist) {
                    setOpenEnterRoomId(id);
                    setOpenSearchModal(false);
                }
            })
            .catch(parseErrorResponse());

        setLoading(false);
    };

    const handleLogout = (): void => {
        localStorage.removeItem("token");
        setUser(undefined);
        router.push(ROUTE.HOME);
    };

    if (!user) {
        return <></>;
    }

    return (
        <div className="p-8 h-screen flex flex-row gap-8">
            <div className="min-w-60 max-w-60 flex flex-col justify-between">
                <div className="flex flex-col justify-start gap-4">
                    <div className="h-12 font-bold text-2xl flex justify-start items-center">
                        <div className="text-hide">HI! {user.nickname}</div>
                    </div>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setOpenCreateModal(true)}
                    >
                        Create Room
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setOpenSearchModal(true)}
                    >
                        Search Room
                    </Button>
                </div>
                <Button fullWidth variant="outlined" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            <RoomTable user={user} onEnter={setOpenEnterRoomId} />
            <EnterModal
                user={user}
                roomId={openEnterRoomId}
                onClose={closeEnterModal}
                onJoin={handleJoinRoom}
            />
            <CreateModal
                user={user}
                open={openCreateModal}
                onClose={closeCreateModal}
                onCreate={handleCreateRoom}
            />
            <SearchModal
                open={openSearchModal}
                onClose={closeSearchModal}
                onSearch={handleSearchRoom}
            />
        </div>
    );
};

export default function Page() {
    const { user } = useUserStore();
    const router = useRouter();
    const [roomId, setRoomId] = useState<string | null>(null);
    const { setLoading } = useLoadingStore();

    const checkRoomId = useCallback(async () => {
        if (!user) {
            return;
        }
        setLoading(true);
        await fetchCheckRoom(user.account).then((response) => {
            const { roomId } = response.data;
            setRoomId(roomId);
        });
        setLoading(false);
    }, [user, setLoading]);

    useEffect(() => {
        checkRoomId();
    }, [checkRoomId]);

    useEffect(() => {
        if (roomId) {
            router.push(ROUTE.ROOM + roomId);
        }
    }, [roomId, router]);

    return roomId === "" ? <Lobby /> : null;
}
