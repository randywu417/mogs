/* eslint-disable @typescript-eslint/no-explicit-any */

import { DependencyList, useCallback, useEffect, useRef } from "react";

type DebounceObj<T extends (...args: any) => any> = {
    callback: T;
    timer: NodeJS.Timeout | null;
};

const useDebounce = <T extends (...args: any) => any>(
    callback: T,
    t: number,
    dep: DependencyList = []
) => {
    const ref = useRef<DebounceObj<T>>({ callback, timer: null });

    useEffect(() => {
        ref.current.callback = callback;
    }, [callback]);

    return useCallback(
        (...args: Parameters<T>) => {
            if (ref.current.timer) {
                clearTimeout(ref.current.timer);
            }
            ref.current.timer = setTimeout(() => {
                ref.current.callback(...args);
            }, t);
        },
        [t, ...dep]
    );
};

export default useDebounce;
