import { useCallback, useEffect, useRef, useState } from 'react';
import { WS_DOMAIN } from '../types';

interface InitWebSocket<T> {
    params?: string;
    port: number;
    onMessage: (e: MessageEvent, sender: (data: T) => void) => void;
    onOpen?: (sender: (data: T) => void) => void;
}

export enum SOCKET_STATUS {
    CONNECTING,
    OPEN,
    CLOSING,
    CLOSED,
}

const STATE_ARR = [SOCKET_STATUS.CONNECTING, SOCKET_STATUS.OPEN, SOCKET_STATUS.CLOSING, SOCKET_STATUS.CLOSED] as const;

const useWebSocket = <T>({ port, params, onOpen, onMessage }: InitWebSocket<T>) => {
    const ws = useRef<WebSocket | null>(null);
    const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);

    const sendMessage = useCallback((data: T) => {
        console.log(['send'], data);
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
        } else {
            console.error('WebSocket is not open');
        }
    }, []);

    useEffect(() => {
        ws.current = new WebSocket(`${WS_DOMAIN}${port}/${params}`);
        ws.current.onopen = () => {
            setReadyState(STATE_ARR[ws.current?.readyState ?? 0]);
            if (onOpen) {
                onOpen(sendMessage);
            }
        };
        ws.current.onclose = () => {
            setReadyState(STATE_ARR[ws.current?.readyState ?? 0]);
        };
        ws.current.onerror = () => {
            setReadyState(STATE_ARR[ws.current?.readyState ?? 0]);
        };
        ws.current.onmessage = (event) => {
            if (onMessage) {
                onMessage(event, sendMessage);
            }
        };
        return () => {
            ws.current?.close();
        };
    }, [params, port, onMessage, sendMessage, onOpen]);

    useEffect(() => {
        console.log(['socket state: ', readyState]);
    }, [readyState]);

    return { ws, readyState };
};

export default useWebSocket;
