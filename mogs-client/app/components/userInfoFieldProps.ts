import { TextFieldProps } from "@mui/material";

const userInfoFieldProps: TextFieldProps = {
    fullWidth: true,
    required: true,
    variant: "outlined",
    size: "small",
    slotProps: { inputLabel: { shrink: true } },
};

export default userInfoFieldProps;
