"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const child_process_1 = require("child_process");
const check = async (msg, cb) => {
    process.stdout.write(`— Checking ${msg} … `);
    try {
        await cb();
        process.stdout.write('✔\n');
    }
    catch (e) {
        process.stdout.write(`❌ [${e}]\n`);
        throw e;
    }
};
const isSuitableEnvironment = async () => {
    try {
        await check('OS', async () => {
            if ((0, os_1.platform)() === 'win32') {
                throw new Error('Windows detected');
            }
        });
        await check('node-gyp', async () => {
            return new Promise((resolve, reject) => {
                (0, child_process_1.exec)('which node-gyp', err => {
                    if (err) {
                        reject('node-gyp not found');
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
        return true;
    }
    catch {
        return false;
    }
};
const install = async () => {
    if (await isSuitableEnvironment()) {
        await new Promise(resolve => {
            const gyp = (0, child_process_1.spawn)('node-gyp', ['rebuild']);
            gyp.on('close', code => {
                console.log(code
                    ? '❌ Compilation failed.'
                    : '✔ Compilation successful.');
                resolve(void 0);
            });
        });
    }
};
install();
