
import { NRF905 } from './nrf905'

new NRF905('gpiochip0', '/dev/spidev0.0', {
    TX_EN: 22,
    TRX_CE: 27,
    PWR_UP: 24,
    CSN: 25,
    CD: 23,
    AM: 5,
    DR: 6
})
