import { DOMAIN } from "./project";

const cors_option = {
    origin: [
        `http://${DOMAIN}:5173`,
        `http://${DOMAIN}:3000`,
        `http://${DOMAIN}:5500`,
        "http://127.0.0.1:5500",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors_option;
