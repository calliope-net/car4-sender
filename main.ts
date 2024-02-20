input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    bMotorPower = !(bMotorPower)
})
let bMotorPower = false
lcd16x2rgb.initLCD(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E))
car4sender.beimStart(240)
bMotorPower = false
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
    car4sender.sendBuffer_setUint8(car4sender.eBufferOffset.b0_Motor, car4sender.joystickValues(car4sender.eJoystickValue.motor))
    car4sender.sendBuffer_setUint8(car4sender.eBufferOffset.b1_Servo, car4sender.joystickValues(car4sender.eJoystickValue.servo))
    car4sender.sendBuffer0_setBit(car4sender.eBufferBit.x80_MotorPower, bMotorPower)
    car4sender.sendBuffer0_setBit(car4sender.eBufferBit.x40_Hupe, input.buttonIsPressed(Button.A))
    car4sender.sendBuffer19()
    basic.turnRgbLedOff()
})
