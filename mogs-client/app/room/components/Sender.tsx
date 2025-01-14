import { UserInfo } from "@/app/types";
import parseErrorResponse from "@/app/utils/parseErrorResponse";
import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPaperPlane } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { fetchChattingMsg } from "../service/api";

interface Props {
    roomId: string;
    user: UserInfo;
    isMessaging: boolean;
    setIsMessaging: (bool: boolean) => void;
}

interface Chatting {
    message: string;
}
const Sender: React.FC<Props> = ({
    roomId,
    user,
    isMessaging,
    setIsMessaging,
}) => {
    const { register, handleSubmit, setValue, watch } = useForm<Chatting>({
        defaultValues: { message: "" },
    });
    const [isComposition, setIsComposition] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const message = watch("message");

    const adjustHeight = () => {
        const ref = textAreaRef.current;
        if (ref) {
            ref.style.height = "24px";
            ref.style.height = `${Math.min(ref.scrollHeight, 72)}px`;
        }
    };

    const onSubmit = async ({ message }: Chatting) => {
        if (!message.trim()) {
            return;
        }

        await fetchChattingMsg({
            roomId,
            chatting: {
                user,
                message: encodeURI(message),
                messageId: uuidv4(),
                time: Date.now(),
            },
        })
            .then(() => setValue("message", ""))
            .catch(parseErrorResponse());

        handleFocus();
    };

    const handleFocus = (): void => {
        textAreaRef.current?.focus();
        setIsMessaging(true);
    };

    useEffect(() => adjustHeight(), [message]);

    return (
        <div className="h-auto flex flex-row justify-between items-end w-full gap-4">
            <div
                className={`bg-white h-auto grow flex flex-row items-center justify-center p-2.5 rounded-md ${
                    isMessaging
                        ? "border border-solid border-slate-500 opacity-100 bg-opacity-100 "
                        : "opacity-80 bg-opacity-0"
                }`}
                onClick={handleFocus}
            >
                <textarea
                    className={`resize-none w-full bg-white text-base outline-none overflow-hidden ${
                        isMessaging
                            ? "placeholder-gray-300 bg-opacity-5 "
                            : "placeholder-white bg-opacity-0 text-white"
                    }`}
                    {...register("message")}
                    ref={(e) => {
                        register("message").ref(e);
                        textAreaRef.current = e;
                    }}
                    placeholder="You can send messages here."
                    onCompositionStart={() => setIsComposition(true)}
                    onCompositionEnd={() => setIsComposition(false)}
                    onBlur={() => setIsMessaging(false)}
                    onClick={handleFocus}
                    onKeyDown={(e) => {
                        if (
                            e.code === "Enter" &&
                            !e.shiftKey &&
                            !isComposition
                        ) {
                            e.preventDefault();
                            handleSubmit(onSubmit)();
                        }
                    }}
                />
            </div>
            <Button
                variant="contained"
                size="large"
                className="w-28 flex flex-row gap-2 h-[46px] bg-white"
                onClick={handleSubmit(onSubmit)}
                disabled={!message.trim()}
            >
                Send <FaPaperPlane size="16px" />
            </Button>
        </div>
    );
};

export default Sender;
