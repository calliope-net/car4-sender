input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    bMotorPower = !(bMotorPower)
})
let bMotorPower = false
lcd16x2rgb.initLCD(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E))
car4sender.beimStart(240)
loops.everyInterval(500, function () {
    if (bMotorPower) {
        basic.setLedColor(0x00ff00)
    } else {
        basic.setLedColor(0x007fff)
    }
    if (car4sender.joystickQwiic()) {
        lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E), 0, 0, 15, car4sender.minmaxZeile(car4sender.eXY.x))
        lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E), 1, 0, 15, car4sender.minmaxZeile(car4sender.eXY.y))
    }
    car4sender.setBitBuffer(3, 7, bMotorPower)
    car4sender.sendBuffer19()
    basic.turnRgbLedOff()
})
