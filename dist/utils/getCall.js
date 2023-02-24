"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalls = void 0;
const getCalls = (address, callAbi, labelName) => {
    return [
        {
            target: address,
            call: [callAbi],
            label: labelName,
        },
    ];
};
exports.getCalls = getCalls;
