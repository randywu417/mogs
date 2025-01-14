import useLoadingStore from "@/app/store/useLoadingStroe";
import { Button, Modal, ModalProps, TextField } from "@mui/material";
import React from "react";
import { useForm, useFormState } from "react-hook-form";

interface Props extends Omit<ModalProps, "children"> {
    onSearch: (roomId: string) => void;
    onClose: () => void;
}

const SearchModal: React.FC<Props> = ({ onSearch, onClose, ...props }) => {
    const { loading } = useLoadingStore();
    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: { isSubmitted },
    } = useForm({
        defaultValues: { roomId: "" },
    });

    const { errors } = useFormState({ control });

    const handleSearch = ({ roomId }: { roomId: string }): void => {
        onSearch(roomId);
    };

    const handleClose = (): void => {
        onClose();
        reset();
    };

    const validateRoomId = (value: string) => {
        if (value.length !== 10 || isNaN(Number(value))) {
            return "Room ID must be 10 digis.";
        }
        return true;
    };

    return (
        <Modal
            {...props}
            slotProps={{ backdrop: { transitionDuration: 0 } }}
            onClose={handleClose}
        >
            <div className="w-[400px] modalFrame">
                <div className="mb-3">
                    <TextField
                        autoFocus
                        required
                        fullWidth
                        size="small"
                        label="Room ID"
                        type="number"
                        hidden
                        placeholder="Please enter digis."
                        slotProps={{ inputLabel: { shrink: true } }}
                        {...register("roomId", { validate: validateRoomId })}
                        error={isSubmitted && Boolean(errors.roomId)}
                        helperText={isSubmitted && errors.roomId?.message}
                    />
                </div>

                <div className="flex flex-row justify-between gap-8">
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        className="w-28"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleSubmit(handleSearch)}
                        variant="contained"
                        className="w-28"
                        disabled={Boolean(loading)}
                    >
                        Search
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default SearchModal;
