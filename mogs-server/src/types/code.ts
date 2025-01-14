export enum ERROR_CODE {
    /**
     * auth failed
     */
    AU00 = 1,
    /**
     * form not completed
     */
    AU01,
    /**
     * validate failed
     */
    AU02,
    /**
     * account is exist
     */
    AU03,
    /**
     * user is not found
     */
    AU04,
    /**
     * password is incorrect
     */
    AU05,
    /**
     * creat room failed
     */
    LC01,
    /**
     * room is not exist
     */
    LJ01,
    /**
     * room is fulled
     */
    LJ02,
    /**
     * room is not found
     */
    LS01,
    /**
     * you are not in room
     */
    RI01,
    /**
     * change people failed
     */
    RC01,
    /**
     * send message failed
     */
    RM01,
    UNKNOW = 9999,
}
