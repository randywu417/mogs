import { ERROR_CODE } from '../types/code';

export const ROOM_MAX_PEOPLE = 12;

export const errorMap: { [key in ERROR_CODE]: string } = {
    [ERROR_CODE.AU00]: 'auth failed',

    [ERROR_CODE.AU01]: 'form not completed',

    [ERROR_CODE.AU02]: 'validate failed',

    [ERROR_CODE.AU03]: 'account is exist',

    [ERROR_CODE.AU04]: 'user is not found',

    [ERROR_CODE.AU05]: 'password is incorrect',

    [ERROR_CODE.LC01]: 'creat room failed',

    [ERROR_CODE.LJ01]: 'room is not exist',

    [ERROR_CODE.LJ02]: 'room is fulled',

    [ERROR_CODE.LS01]: 'room is not found',

    [ERROR_CODE.RI01]: 'you are not in room',

    [ERROR_CODE.RC01]: 'change people failed',

    [ERROR_CODE.RM01]: 'send message failed',

    [ERROR_CODE.UNKNOW]: 'unknow error',
};
