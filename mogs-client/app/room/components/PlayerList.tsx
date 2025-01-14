import { colorMap } from "@/app/lobby/model/data";
import { UserInRoom } from "@/app/lobby/model/types";
import { UserInfo } from "@/app/types";
import React from "react";
import { FaStar } from "react-icons/fa6";

interface Props {
    host: UserInfo;
    users: Array<UserInRoom>;
    onlineStatus: Map<string, boolean>;
}
const PlayerList: React.FC<Props> = ({ host, users, onlineStatus }) => {
    const isHost = (acc: string): boolean => acc === host.account;

    const isOnline = (acc: string): boolean => Boolean(onlineStatus.get(acc));

    return (
        <div className="p-2 grow rounded-md overflow-auto bg-white bg-opacity-60 border border-solid border-slate-600 shadow-custom ">
            <ul className="list-disc">
                {users.map(({ account, nickname, color }) => (
                    <li key={account} className="flex flex-row items-center">
                        <div
                            className={`min-w-2 min-h-2 w-2 h-2 rounded-full mr-2 ${
                                isOnline(account)
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                            }`}
                        />
                        <div
                            className={`text-hide ${
                                isHost(account)
                                    ? "max-w-[calc(100%-24px-16px)] mr-2"
                                    : "max-w-[calc(100%-16px)]"
                            }`}
                            style={{
                                color: isOnline(account)
                                    ? colorMap[color]
                                    : "#9ca3af",
                            }}
                        >
                            {nickname} ({account})
                        </div>
                        {isHost(account) && (
                            <FaStar
                                className="text-yellow-400 w-4"
                                size="16px"
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
