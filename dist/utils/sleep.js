"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const sleep = async (ms, msg) => {
    msg && console.log(msg !== true ? msg : "Timout " + ms / 1000 + " sec...");
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};
exports.sleep = sleep;
