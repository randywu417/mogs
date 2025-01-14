import { errorMap } from "../model/data";
import useSnackStore from "../store/useSnackStore";
import { ERROR_CODE } from "../types/code";

const handleErrorCode: (code: ERROR_CODE) => void = (c: ERROR_CODE) => {
    useSnackStore.getState().setSnackStatus({
        status: "fail",
        message: errorMap[c],
    });
};
interface Option {
    errorHandler?: (code: ERROR_CODE) => void;
    callback?: (code: ERROR_CODE) => void;
}
const parseErrorResponse = (option: Option = {}) => {
    const { errorHandler, callback } = option;
    const handle = errorHandler ?? handleErrorCode;
    return (err: unknown) => {
        const code =
            typeof err === "object" &&
            err &&
            "code" in err &&
            typeof err.code === "number" &&
            err.code in errorMap
                ? err.code
                : ERROR_CODE.UNKNOW;
        handle(code);
        if (callback) {
            callback(code);
        }
    };
};

export default parseErrorResponse;
