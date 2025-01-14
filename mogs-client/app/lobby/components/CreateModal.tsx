import { ROOM_MAX_PEOPLE } from "@/app/model/data";
import useLoadingStore from "@/app/store/useLoadingStroe";
import { COLOR, UserInfo } from "@/app/types";
import { validateRoomName } from "@/app/utils/validate";
import {
    Button,
    ButtonGroup,
    Modal,
    ModalProps,
    TextField,
} from "@mui/material";
import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { FaMinus, FaPlus } from "react-icons/fa";
import { colorMap, colors } from "../model/data";
import { CreateRoomForm } from "../model/types";

interface Props extends Omit<ModalProps, "children"> {
    user: UserInfo;
    onCreate: (info: CreateRoomForm) => void;
    onClose: () => void;
}

const CreateModal: React.FC<Props> = ({
    user,
    onCreate,
    onClose,
    ...props
}) => {
    const { loading, setLoading } = useLoadingStore();
    const {
        control,
        register,
        watch,
        setValue,
        reset,
        handleSubmit,
        formState: { isSubmitted },
    } = useForm<CreateRoomForm>({
        defaultValues: {
            host: user,
            name: "",
            numberOfPeople: ROOM_MAX_PEOPLE,
            color: COLOR.RED,
        },
    });
    const { errors } = useFormState({ control });
    const [numberOfPeople, color] = watch(["numberOfPeople", "color"]);

    const onChangePeople = (calculate: (n: number) => number) => {
        return () => {
            const n = calculate(numberOfPeople);
            if (n < 1 || n > ROOM_MAX_PEOPLE) {
                return;
            }
            setValue("numberOfPeople", n);
        };
    };

    const onReset = (): void => {
        onClose();
        reset();
    };

    const onSubmit = async (form: CreateRoomForm): Promise<void> => {
        setLoading(true);
        try {
            await onCreate(form);
        } catch {
            setLoading(false);
        }
    };

    return (
        <Modal
            {...props}
            slotProps={{ backdrop: { transitionDuration: 0 } }}
            onClose={onReset}
        >
            <div className="w-[400px] modalFrame">
                <TextField
                    required
                    fullWidth
                    size="small"
                    label="Room Name"
                    placeholder="Please enter 4 ~ 10 chars."
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("name", { validate: validateRoomName })}
                    error={isSubmitted && Boolean(errors.name)}
                    helperText={isSubmitted && errors.name?.message}
                />
                <div className="flex flex-row items-center gap-4 mt-2">
                    <ButtonGroup variant="outlined" className="h-10">
                        <Button
                            className="w-20 mr-1"
                            onClick={onChangePeople((n) => n - 1)}
                        >
                            <FaMinus size="18px" />
                        </Button>
                        <TextField
                            required
                            fullWidth
                            size="small"
                            label="Number of People"
                            placeholder="Please enter 4 ~ 10 chars."
                            value={numberOfPeople + " / " + ROOM_MAX_PEOPLE}
                            aria-readonly
                            slotProps={{
                                inputLabel: { shrink: true },
                                input: { sx: { borderRadius: "0px" } },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    pointerEvents: "none",
                                    "& fieldset": {
                                        borderColor: "rgba(0, 0, 255, 0.5)",
                                        borderLeftWidth: "0.5px",
                                        borderRightWidth: "0px",
                                    },
                                },
                            }}
                        />
                        <Button
                            className="w-20"
                            onClick={onChangePeople((n) => n + 1)}
                        >
                            <FaPlus size="18px" />
                        </Button>
                    </ButtonGroup>
                </div>
                <div className="mb-2">
                    <div className="mb-2">Your Color: </div>
                    <div className="flex flex-row flex-wrap items-center justify-between gap-4">
                        {colors.map((c) => (
                            <button
                                key={c}
                                className={`w-10 h-10 rounded-full border-2 border-solid transition-all ${
                                    color === c
                                        ? "border-gray-600 opacity-100"
                                        : "border-white opacity-30"
                                }`}
                                style={{ backgroundColor: colorMap[c] }}
                                onClick={() => setValue("color", c)}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-row justify-between gap-8">
                    <Button
                        onClick={onReset}
                        variant="outlined"
                        className="w-28"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        variant="contained"
                        className="w-28"
                        disabled={Boolean(loading)}
                    >
                        Create
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateModal;
