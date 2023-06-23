import { SPIConfiguration } from '.'
import { SPI_3WIRE, SPI_CPHA, SPI_CPOL, SPI_CS_HIGH, SPI_LOOP, SPI_LSB_FIRST, SPI_NO_CS, SPI_READY } from './consts'

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
