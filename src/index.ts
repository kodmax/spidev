import { closeSync, openSync } from "fs"

import { SPIConfiguration, TransferSettings, decode, encode } from "./spi-config"
import { spiDevNode } from "./spidev"

export class SPIDev {
    private readonly fd: number

    public constructor(path: string, configuration?: Partial<SPIConfiguration>) {
        this.fd = openSync(path, 'r+', 0)

        if (configuration) {
            this.setConfiguration(configuration)
        }
    }

    public transfer(size: number, data: Uint8Array, settings: Partial<TransferSettings> = {}) {
        const { bits_per_word = 0, delay_usecs = 0, cs_change = 0, speed_hz = 0 } = settings

        const output = spiDevNode.spi_transfer(this.fd, size, data, bits_per_word, delay_usecs, cs_change, speed_hz)
        if (Number.isInteger(output)) {
            throw new Error('Transfer error: ' + output)
        }

        return Uint8Array.from(output)
    }

    private setConfiguration(configuration: Partial<SPIConfiguration>): void {
        const err = spiDevNode.spi_set_configuration(this.fd, ...encode(configuration))
        if (err) {
            throw new Error('SPI device configuration error: ' + err)
        }
    }

    public getConfiguration(): SPIConfiguration {
        const config = spiDevNode.spi_get_configuration(this.fd)
        if (Number.isInteger(config)) {
            throw new Error('Error reading SPI configuration: ' + config)
        }

        return decode(config[0], config[1], config[2])
    }

    public close() {
        closeSync(this.fd)
    }
}