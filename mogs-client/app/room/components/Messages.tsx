import { colorMap } from "@/app/lobby/model/data";
import { UserInRoom } from "@/app/lobby/model/types";
import { COLOR, UserInfo } from "@/app/types";
import React, { useEffect, useRef } from "react";
import { Chatting, Notify } from "../model/types";
import { isChatting, isSameUser } from "../utils";

interface ChattingProps {
    hideName: boolean;
    user: UserInfo;
    chatting: Chatting;
    color?: COLOR;
}

const Chat: React.FC<ChattingProps> = ({
    hideName,
    user,
    chatting,
    color = COLOR.RED,
}) => {
    const myMsg = user.account === chatting.user.account;
    const talk = {
        username: myMsg ? "self-end" : "self-start",
        msg: myMsg
            ? "self-end rounded-se-none text-gray-800 bg-green-300"
            : "self-start rounded-ss-none text-gray-50 bg-slate-800",
    } as const;

    const sliceText = (str: string) => str.split("%0A");

    return (
        <>
            {!hideName && (
                <div
                    className={talk.username}
                    style={{ color: colorMap[color] }}
                >
                    {chatting.user.nickname}
                </div>
            )}
            <div
                className={
                    talk.msg +
                    " w-auto max-w-full rounded-[12px] p-1.5 px-3 break-all mt-0.5"
                }
            >
                {sliceText(chatting.message).map((text, index) => (
                    <React.Fragment key={index}>
                        <>{decodeURI(text)}</>
                        <br />
                    </React.Fragment>
                ))}
            </div>
        </>
    );
};

interface Props {
    user: UserInfo;
    users: Array<UserInRoom>;
    messages: Array<Chatting | Notify>;
}

const Messages: React.FC<Props> = ({ user, users, messages }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            ref={scrollContainerRef}
            className="p-3 grow rounded-md overflow-auto bg-white bg-opacity-60 border border-solid border-slate-600 shadow-custom"
            style={{ scrollbarWidth: "none" }}
        >
            {messages.map((msg, index, arr) => (
                <li
                    key={msg.messageId}
                    className="w-full mt-1 list-none pr-0 flex flex-col"
                >
                    {isChatting(msg) ? (
                        <Chat
                            key={msg.messageId}
                            hideName={isSameUser(arr, index)}
                            user={user}
                            chatting={msg}
                            color={
                                users.find(
                                    (u) => u.account === msg.user.account
                                )?.color
                            }
                        />
                    ) : (
                        <div className="py-0.5 text-center text-sm">
                            {msg.message}
                        </div>
                    )}
                </li>
            ))}
        </div>
    );
};

export default Messages;
