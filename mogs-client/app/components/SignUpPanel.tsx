import { Button, TextField } from "@mui/material";
import React from "react";
import { useForm, useFormState } from "react-hook-form";
import useLoadingStore from "../store/useLoadingStroe";
import { SignUpForm } from "../types";
import {
    validateAccount,
    validateNickname,
    validatePassword,
} from "../utils/validate";
import userInfoFieldProps from "./userInfoFieldProps";

interface Props {
    onSubmit: (form: SignUpForm) => void;
}

const SignUpPanel: React.FC<Props> = ({ onSubmit }) => {
    const { loading } = useLoadingStore();
    const {
        control,
        register,
        handleSubmit,
        formState: { isSubmitted },
    } = useForm<SignUpForm>({
        defaultValues: {
            nickname: "",
            account: "",
            password: "",
            confirmPassword: "",
        },
    });
    const { errors } = useFormState({ control });

    return (
        <div className="w-full h-auto flex flex-col gap-6 justify-start m-auto items-center">
            <TextField
                {...userInfoFieldProps}
                label="Nickname"
                placeholder="Enter 4 ~ 12 characters"
                {...register("nickname", {
                    validate: validateNickname,
                })}
                error={isSubmitted && Boolean(errors.nickname)}
                helperText={isSubmitted && errors.nickname?.message}
            />
            <TextField
                {...userInfoFieldProps}
                label="Account"
                placeholder="Enter 6 ~ 20 characters"
                {...register("account", {
                    validate: validateAccount,
                })}
                error={isSubmitted && Boolean(errors.account)}
                helperText={isSubmitted && errors.account?.message}
            />
            <TextField
                {...userInfoFieldProps}
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter 8 ~ 20 characters"
                {...register("password", {
                    validate: validatePassword,
                })}
                error={isSubmitted && Boolean(errors.password)}
                helperText={isSubmitted && errors.password?.message}
            />
            <TextField
                {...userInfoFieldProps}
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter 8 ~ 20 characters"
                {...register("confirmPassword", {
                    validate: validatePassword,
                })}
                error={isSubmitted && Boolean(errors.confirmPassword)}
                helperText={isSubmitted && errors.confirmPassword?.message}
            />
            <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={Boolean(loading)}
            >
                Submit
            </Button>
        </div>
    );
};

export default SignUpPanel;
