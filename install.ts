import { platform } from 'os'
import { exec, spawn } from 'child_process'

const check = async (msg: string, cb: () => Promise<void>): Promise<void> => {
    process.stdout.write(`— Checking ${msg} … `)
    try {
        await cb()
        process.stdout.write('✔\n')

    } catch (e) {
        process.stdout.write(`❌ [${e}]\n`)
        throw e
    }
}

const isSuitableEnvironment = async () => {
    try {
        await check('OS', async () => {
            if (platform() === 'win32') {
                throw new Error('Windows detected')
            }
        })

        await check('node-gyp', async () => {
            return new Promise((resolve, reject) => {
                exec('which node-gyp', err => {
                    if (err) {
                        reject('node-gyp not found')

                    } else {
                        resolve()
                    }
                })
            })
        })

        return true

    } catch {
        return false
    }
}

const install = async () => {
    if (await isSuitableEnvironment()) {
        await new Promise(resolve => {
            const gyp = spawn('node-gyp', ['rebuild'])
            gyp.on('close', code => {
                console.log(code
                    ? '❌ Compilation failed.'
                    : '✔ Compilation successful.'
                )

                resolve(void 0)
            })
        })
    }
}

install()
