
import { NRF905 } from './nrf905'

const nRF905 = new NRF905('gpiochip0', '/dev/spidev0.0', {
    TX_EN: 22,
    TRX_CE: 27,
    PWR_UP: 23,
    CSN: 24,
    CD: 25,
    AM: 5,
    DR: 6
})

const main = async () => {
    
}

main()