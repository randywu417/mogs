import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

export const verifyPassword = async (
    inputPassword: string,
    storedHashedPassword: string
): Promise<boolean> => {
    const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
    return isMatch;
};

type ValidateResult = boolean | string;

export const validateNickname = (nickname: string): ValidateResult => {
    if (nickname.length < 4 || nickname.length > 12) {
        return "Nickname must be between 4 and 12 characters long.";
    }
    if (/\s/.test(nickname)) {
        return "Nickname cannot contain spaces.";
    }
    return true;
};

export const validateAccount = (account: string): ValidateResult => {
    if (account.length < 6 || account.length > 20) {
        return "Account must be between 6 and 20 characters long.";
    }

    // if (!/^[a-zA-Z]/.test(account)) {
    //     return "Account must start with a letter.";
    // }

    // if (!/^[a-zA-Z0-9_]+$/.test(account)) {
    //     return "Account can only contain letters, numbers, and underscores.";
    // }

    return true;
};

export const validatePassword = (password: string): ValidateResult => {
    if (password.length < 8 || password.length > 20) {
        return "Password must be between 8 and 20 characters long.";
    }

    // if (!/(?=.*[a-z])/.test(password)) {
    //     return "Password must contain at least one lowercase letter.";
    // }
    // if (!/(?=.*[A-Z])/.test(password)) {
    //     return "Password must contain at least one uppercase letter.";
    // }
    // if (!/(?=.*\d)/.test(password)) {
    //     return "Password must contain at least one number.";
    // }
    // if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
    //     return "Password must contain at least one special character.";
    // }

    // if (/\s/.test(password)) {
    //     return "Password cannot contain spaces.";
    // }

    return true;
};

export const validateRoomName = (roomname: string): ValidateResult => {
    if (roomname.length < 4 || roomname.length > 20) {
        return "Name must be between 4 and 20 characters long.";
    }
    if (/\s/.test(roomname)) {
        return "Room Name cannot contain spaces.";
    }
    return true;
};
