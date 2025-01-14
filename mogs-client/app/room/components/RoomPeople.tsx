import useDebounce from "@/app/hooks/useDebounce";
import { ROOM_MAX_PEOPLE } from "@/app/model/data";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { ChangePeopleReq } from "../model/types";
import { fetchChangePeople } from "../service/api";

const PeopleController: React.FC<Omit<Props, "isHost">> = ({
    roomId,
    curPeople,
    maxPeople,
}) => {
    const [currMaxPeople, setCurrMaxPeople] = useState(maxPeople);

    const debounceChangePeople = useDebounce(async (req: ChangePeopleReq) => {
        await fetchChangePeople(req);
    }, 1000);

    const handleChangePeople = (calculate: (n: number) => number) => {
        return async () => {
            const n = calculate(currMaxPeople);
            if (n < curPeople || n > ROOM_MAX_PEOPLE) {
                return;
            }
            setCurrMaxPeople(n);
            await debounceChangePeople({ roomId, newPeople: n });
        };
    };

    return (
        <>
            <Button
                variant="contained"
                size="medium"
                className="h-full"
                disabled={currMaxPeople <= curPeople}
                onClick={handleChangePeople((n) => n - 1)}
            >
                <FaMinus size="20px" />
            </Button>
            <div className="w-14 text-center">
                {curPeople} / {currMaxPeople}
            </div>
            <Button
                variant="contained"
                size="medium"
                className="h-full"
                disabled={currMaxPeople >= ROOM_MAX_PEOPLE}
                onClick={handleChangePeople((n) => n + 1)}
            >
                <FaPlus size="20px" />
            </Button>
        </>
    );
};

interface Props {
    isHost: boolean;
    roomId: string;
    curPeople: number;
    maxPeople: number;
}
const RoomPeople: React.FC<Props> = ({
    isHost,
    roomId,
    curPeople,
    maxPeople,
}) => {
    return (
        <div className="flex flex-row justify-end items-center gap-2">
            Current people:&nbsp;
            {isHost ? (
                <PeopleController
                    roomId={roomId}
                    curPeople={curPeople}
                    maxPeople={maxPeople}
                />
            ) : (
                <div className="w-14 text-center">
                    {curPeople} / {maxPeople}
                </div>
            )}
        </div>
    );
};

export default RoomPeople;
