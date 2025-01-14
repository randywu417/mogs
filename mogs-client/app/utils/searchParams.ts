export const convertToSearchParams = (obj: object): string => {
    const params: Array<string> = new Array(0);
    Object.entries(obj).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            params.push(`${key}=${encodeURIComponent(value)}`);
        }
    });
    if (params.length > 0) {
        return `?${params.join("&")}`;
    }
    return "";
};
