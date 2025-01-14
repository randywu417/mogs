import { AxiosResponse } from "axios";

export default class FetchResponse<T = undefined> {
    status: number;
    error: string;
    message: string;
    data: T;
    errorDetail: string;

    constructor(response: AxiosResponse) {
        this.status = response.status;
        this.error = "";
        this.message = response.statusText;
        this.data = response.data;
        this.errorDetail = "";
    }
}
