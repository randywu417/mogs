import { Button, TextField } from "@mui/material";
import React from "react";
import { useForm, useFormState } from "react-hook-form";
import useLoadingStore from "../store/useLoadingStroe";
import { SignInForm } from "../types";
import { validateAccount, validatePassword } from "../utils/validate";
import userInfoFieldProps from "./userInfoFieldProps";

interface Props {
    onLogin: (form: SignInForm) => void;
}

const SignInPanel: React.FC<Props> = ({ onLogin }) => {
    const { loading } = useLoadingStore();
    const {
        control,
        register,
        handleSubmit,
        formState: { isSubmitted },
    } = useForm<SignInForm>({
        defaultValues: {
            account: "",
            password: "",
        },
    });
    const { errors } = useFormState({ control });

    return (
        <div className="w-full h-full flex flex-col gap-6 justify-between m-auto items-center">
            <div className="w-full flex flex-col gap-6">
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
                    placeholder="Enter 8 ~ 20 characters"
                    {...register("password", {
                        validate: validatePassword,
                    })}
                    error={isSubmitted && Boolean(errors.password)}
                    helperText={isSubmitted && errors.password?.message}
                />
            </div>
            <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit(onLogin)}
                disabled={Boolean(loading)}
            >
                Login
            </Button>
        </div>
    );
};

export default SignInPanel;
