const SPI_CPHA = 0x01
const SPI_CPOL = 0x02
const SPI_CS_HIGH = 0x04
const SPI_LSB_FIRST = 0x08
const SPI_3WIRE = 0x10
const SPI_LOOP = 0x20
const SPI_NO_CS = 0x40
const SPI_READY = 0x80

export const SPI_MODE_0 = (0 | 0)
export const SPI_MODE_1 = (0 | SPI_CPHA)
export const SPI_MODE_2 = (SPI_CPOL | 0)
export const SPI_MODE_3 = (SPI_CPOL | SPI_CPHA)

export type SPI_MODE = typeof SPI_MODE_0 | typeof SPI_MODE_1 | typeof SPI_MODE_2 | typeof SPI_MODE_3

export type SPIConfiguration = {
    SPI_MODE: SPI_MODE,
    SPI_CS_HIGH: boolean,
    SPI_LSB_FIRST: boolean,
    SPI_3WIRE: boolean,
    SPI_LOOP: boolean,
    SPI_NO_CS: boolean,
    SPI_READY: boolean,
    BITS_PER_WORD: number,
    MAX_SPEED_HZ: number
}

export type TransferSettings = {
    bits_per_word: number
    delay_usecs: number
    cs_change: number
    speed_hz: number
}

export const decode = (mode: number, bitsPerWord: number, maxSpeedHz: number): SPIConfiguration => {
    return {
        SPI_MODE: mode & (SPI_CPOL | SPI_CPHA),

        SPI_LSB_FIRST: Boolean(mode & SPI_LSB_FIRST),
        SPI_CS_HIGH: Boolean(mode & SPI_CS_HIGH),
        SPI_3WIRE: Boolean(mode & SPI_3WIRE),
        SPI_NO_CS: Boolean(mode & SPI_NO_CS),
        SPI_READY: Boolean(mode & SPI_READY),
        SPI_LOOP: Boolean(mode & SPI_LOOP),

        BITS_PER_WORD: bitsPerWord,
        MAX_SPEED_HZ: maxSpeedHz
    }
}

export const encode = (config: Partial<SPIConfiguration>): [mode: number, bitsPerWord: number, maxSpeedHz: number] => {
    return [
        ((config.SPI_MODE ?? 0) & (SPI_CPOL | SPI_CPHA))
        + (config.SPI_LSB_FIRST ? SPI_LSB_FIRST : 0)
        + (config.SPI_CS_HIGH ? SPI_CS_HIGH : 0)
        + (config.SPI_3WIRE ? SPI_3WIRE : 0)
        + (config.SPI_NO_CS ? SPI_NO_CS : 0)
        + (config.SPI_READY ? SPI_READY : 0)
        + (config.SPI_LOOP ? SPI_LOOP : 0),
        config.BITS_PER_WORD ?? 0,
        config.MAX_SPEED_HZ ?? 0
    ]
}
