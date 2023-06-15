import { GPIOController } from "gpiod-client"
import { Pins } from "./pins"
import { GPIOOutputLine } from "gpiod-client/dist/src/gpio-output-line"
import { SPIDev } from "../../src"

export class SDD1306 {
    private readonly gpio: GPIOController
    private readonly spidev: SPIDev

    private readonly RES: GPIOOutputLine
    private readonly CS: GPIOOutputLine
    private readonly DC: GPIOOutputLine

    public constructor(chipname: string, path: string, pins: Pins) {
        this.gpio = new GPIOController(chipname, 'this')

        this.RES = this.gpio.requestLineAsOutput(pins.RES, 0)
        this.CS = this.gpio.requestLineAsOutput(pins.CS, 1)
        this.DC = this.gpio.requestLineAsOutput(pins.DC, 0)

        this.spidev = new SPIDev(path, {
            MAX_SPEED_HZ: 1000000,
            SPI_LSB_FIRST: false,
            BITS_PER_WORD: 8,
            SPI_NO_CS: true,
            SPI_MODE: 0,
        })

        this.RES.trigger(0, 1000)
        this.setDisplayOff()

        this.setContrastControl(0xcf)
        this.setSegmentRemap()
        this.setNormalInverseDisplay()
        this.setMultiplexRatio(0x3f)
        this.setCOMOutputScanDirection()
        this.setDisplayOffset(0x00)
        this.setDisplayClock(0x80)
        this.setPreChargePeriod(0xf1)
        this.setCOMPinsHardwareConfiguration(0x12)
        this.setVCOMHDeselectLevel(0x40)
        this.setChargePump(0x14)
        
        this.setDisplayOn()
    }

    public reset(): void {
        this.RES.trigger(0, 1000)
    }

    public data(data: Uint8Array): void {
        this.DC.setValue(1)
        this.CS.setValue(0)

        this.spidev.transfer(data.byteLength, data)
        this.CS.setValue(1)
    }

    public cmd(cmd: Uint8Array): void {
        this.DC.setValue(0)
        this.CS.setValue(0)

        this.spidev.transfer(1, cmd)
        this.CS.setValue(1)
    }

    public setDisplayOff(): void {
        this.cmd(Uint8Array.from([0xAE]))
    }

    public setDisplayClock(value: number): void {
        this.cmd(Uint8Array.from([0xd5]))
        this.cmd(Uint8Array.from([value]))
    }

    public setMultiplexRatio(value: number): void {
        this.cmd(Uint8Array.from([0xa8]))
        this.cmd(Uint8Array.from([value]))
    }

    public setDisplayOffset(value: number): void {
        this.cmd(Uint8Array.from([0xd3]))
        this.cmd(Uint8Array.from([value]))
    }

    public setDisplayStartLine(): void {
        this.cmd(Uint8Array.from([0x40])) /*set display start line*/
    }

    public setChargePump(value: number): void {
        this.cmd(Uint8Array.from([0x8d]))
        this.cmd(Uint8Array.from([value]))
    }

    public setSegmentRemap(): void {
        this.cmd(Uint8Array.from([0xa1]))
    }

    public setCOMOutputScanDirection(): void {
        this.cmd(Uint8Array.from([0xc8]))
    }

    public setCOMPinsHardwareConfiguration(value: number): void {
        this.cmd(Uint8Array.from([0xda]))
        this.cmd(Uint8Array.from([value]))
    }

    public setContrastControl(value: number): void {
        this.cmd(Uint8Array.from([0x81]))
        this.cmd(Uint8Array.from([value]))
    }

    public setPreChargePeriod(value: number): void {
        this.cmd(Uint8Array.from([0xd9]))
        this.cmd(Uint8Array.from([value]))
    }

    public setVCOMHDeselectLevel(value: number): void {
        this.cmd(Uint8Array.from([0xdb]))
        this.cmd(Uint8Array.from([value]))
    }

    public setDisplayOnOff(): void {
        this.cmd(Uint8Array.from([0xa4]))
    }

    public setDisplayOn(): void {
        this.cmd(Uint8Array.from([0xaf]))
    }

    public setNormalInverseDisplay(): void {
        this.cmd(Uint8Array.from([0xa6]))
    }

    public setup(): void {
        // this.cmd(Uint8Array.from([0x00])) /*set lower column address*/
        // this.cmd(Uint8Array.from([0x10])) /*set higher column address*/
        // this.cmd(Uint8Array.from([0x40])) /*set display start line*/
        // this.cmd(Uint8Array.from([0xB0])) /*set page address*/


        // this.cmd(Uint8Array.from([0x00])) /*set lower column address*/
        // this.cmd(Uint8Array.from([0x10])) /*set higher column address*/
        // this.cmd(Uint8Array.from([0xB0])) /*set page address*/
    }

    public release(): void {
        this.spidev.close()
        this.gpio.close()
    }
}