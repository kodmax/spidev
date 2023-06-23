import { SPIConfiguration } from '.'
import { SPI_3WIRE, SPI_CPHA, SPI_CPOL, SPI_CS_HIGH, SPI_LOOP, SPI_LSB_FIRST, SPI_NO_CS, SPI_READY } from './consts'

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
