export default (callback: Function, t: number) => {
    let timer: NodeJS.Timeout | null = null;
    return (...args: any) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            callback(...args);
        }, t);
    };
};
