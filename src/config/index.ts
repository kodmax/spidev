import { SPI_CPHA, SPI_CPOL } from './consts'

export const SPI_MODE_0 = (0 | 0)
export const SPI_MODE_1 = (0 | SPI_CPHA)
export const SPI_MODE_2 = (SPI_CPOL | 0)
export const SPI_MODE_3 = (SPI_CPOL | SPI_CPHA)

export type SPI_MODE = typeof SPI_MODE_0 | typeof SPI_MODE_1 | typeof SPI_MODE_2 | typeof SPI_MODE_3

export type SPIConfiguration = {
    SPI_MODE: SPI_MODE
    SPI_CS_HIGH: boolean
    SPI_LSB_FIRST: boolean
    SPI_3WIRE: boolean
    SPI_LOOP: boolean
    SPI_NO_CS: boolean
    SPI_READY: boolean
    BITS_PER_WORD: number
    MAX_SPEED_HZ: number
}

export type TransferSettings = {
    bits_per_word: number
    delay_usecs: number
    cs_change: number
    speed_hz: number
}




