import checkRoom from "./lobby/checkRoom";
import create from "./lobby/create";
import getRooms from "./lobby/getRooms";
import join from "./lobby/join";
import roomDetails from "./lobby/roomDetails";
import search from "./lobby/search";
import changePeople from "./room/changePeople";
import chatting from "./room/chatting";
import exit from "./room/exit";
import info from "./room/info";
import signin from "./sign/signin";
import signup from "./sign/signup";

export default {
    lobby: {
        checkRoom: checkRoom,
        create: create,
        join: join,
        roomDetails: roomDetails,
        search: search,
        getRooms: getRooms,
    },
    room: {
        info: info,
        exit: exit,
        changePeople: changePeople,
        chatting: chatting,
    },
    sign: {
        signin: signin,
        signup: signup,
    },
};
