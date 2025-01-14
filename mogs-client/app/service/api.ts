import * as fetch from "@/app/utils/fetch";
import FetchResponse from "@/app/utils/fetchResponse";
import { SignInForm, SignUpForm } from "../types";

interface SignInRes {
    tk: string;
}
export const fetchSignIn = async (
    req: SignInForm
): Promise<FetchResponse<SignInRes>> => {
    return new Promise((resolve, reject) => {
        fetch
            .post(`/api/sign/signin`, req)
            .then((response) => {
                resolve(new FetchResponse<SignInRes>(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};

interface SignUpRes {
    success: boolean;
}
export const fetchSignUp = async (req: SignUpForm) => {
    return new Promise((resolve, reject) => {
        fetch
            .post(`/api/sign/signup`, req)
            .then((response) => {
                resolve(new FetchResponse<SignUpRes>(response));
            })
            .catch((error) => {
                reject(error.response.data);
            });
    });
};
