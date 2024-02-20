//% color=#007F00 icon="\uf0d1" block="CaR 4 Sender" weight=28
//% groups='["beim Start","Motor","Servo"]'
namespace car4sender
/*
*/ {
    const i2cqwiicJoystick_x20 = 0x20

    export const n_Simulator: boolean = ("€".charCodeAt(0) == 8364) // true, wenn der Code im Simulator läuft
    //let n_Buffer19 = Buffer.create(19) // wird gesendet mit radio.sendBuffer
    export let n_x: number, n_y: number, n_xMotor: number, n_yServo: number
    let n_xmin = 128, n_xmax = 128, n_ymin = 128, n_ymax = 128

    // ========== group="beim Start"

    //% group="beim Start"
    //% block="CaR4 Sender beim Start Funkgruppe %funkgruppe" weight=8
    //% funkgruppe.min=0 funkgruppe.max=255 funkgruppe.defl=240

    //% inlineInputMode=inline 
    export function beimStart(funkgruppe: number) {
        // Parameter
        radio.setGroup(funkgruppe)
        radio.setTransmitPower(7)
    }

    //% group="Bluetooth senden" color=#E3008C
    //% block="Datenpaket senden" weight=9
    /* export function sendBuffer19() {
        n_Buffer19.setUint8(0,n_xMotor)
        n_Buffer19.setUint8(1,n_yServo)
        radio.sendBuffer(n_Buffer19)
    } */


    //% group="Joystick"
    //% block="Joystick %pJoystickValue" weight=9
    export function joystickValues(pJoystickValue: eJoystickValue) {
        switch (pJoystickValue) {
            case eJoystickValue.x: return n_x
            case eJoystickValue.y: return n_y
            case eJoystickValue.motor: return n_xMotor
            case eJoystickValue.servo: return n_yServo
            default: return 0
        }
    }

    //% group="Joystick"
    //% block="Joystick Qwiic einlesen" weight=8
    export function joystickQwiic() {
        if (pins.i2cWriteBuffer(i2cqwiicJoystick_x20, Buffer.fromArray([3]), true) != 0)
            return false
        else {
            let bu = pins.i2cReadBuffer(i2cqwiicJoystick_x20, 3)
            n_x = bu.getUint8(0)
            n_y = bu.getUint8(2)
            // Motor
            if (between(n_x, 124, 132)) n_xMotor = 128
            else n_xMotor = n_x
            // Servo
            if (between(n_y, 122, 134)) n_yServo = 90 // Ruhestellung soll 128 ist auf 128 = 90° anpassen
            else if (n_y < 20) n_yServo = 135 // Werte < 20 wie 0 behandeln (max links)
            else if (n_y > 235) n_yServo = 45 // Werte > 235 wie 255 behandeln (max rechts)
            else n_yServo = Math.map(n_y, 20, 235, 134, 46) // Werte von 32 bis 991 auf 46° bis 134° verteilen

            n_yServo = Math.round(n_yServo)
            //n_yservo = Math.round(n_yservo / 3 - 14) // 0=31 90=16 135=1
            return true
        }
    }

    //% group="Joystick"
    //% block="minmaxZeile %pXY" weight=8
    export function minmaxZeile(pXY: eXY) {
        switch (pXY) {
            case eXY.x: {
                if (n_x > 0 && n_x < n_xmin) n_xmin = n_x
                else if (n_x < 255 && n_x > n_xmax) n_xmax = n_x
                return format(n_x, 4, eAlign.right) + format(n_xmin, 4, eAlign.right) + format(n_xmax, 4, eAlign.right) + format(n_xMotor, 4, eAlign.right)
            }
            case eXY.y: {
                if (n_y > 0 && n_y < n_ymin) n_ymin = n_y
                else if (n_y < 255 && n_y > n_ymax) n_ymax = n_y
                return format(n_y, 4, eAlign.right) + format(n_ymin, 4, eAlign.right) + format(n_ymax, 4, eAlign.right) + format(n_yServo, 4, eAlign.right)
            }
            default: return ""
        }
    }



    // ========== advanced=true ==========


    // ========== group="ein Bit aus Number (bis 32 Bit) lesen und ändern" advanced=true

    //% group="ein Bit aus Number (bis 32 Bit) lesen und ändern" advanced=true
    //% block="Zahl %pInt getBit 2** %exp" weight=4
    //% exp.min=0 exp.max=31
    /* export function getBit(pInt: number, exp: number): boolean {
        exp = Math.trunc(exp)
        if (between(exp, 0, 63))
            return (pInt & 2 ** exp) != 0
        else
            return false
    } */

    //% group="ein Bit aus Number (bis 32 Bit) lesen und ändern" advanced=true
    //% block="Zahl %pInt setBit 2** %exp %pBit" weight=2
    //% exp.min=0 exp.max=31
    /* export function setBit(pInt: number, exp: number, pBit: boolean) {
        exp = Math.trunc(exp)
        if (between(exp, 0, 63)) {
            if (pBit)
                return pInt | 2 ** exp
            else
                return pInt & ~(2 ** exp)
        } else
            return pInt
    } */

    //% group="ein Bit aus Number (bis 32 Bit) lesen und ändern" advanced=true
    //% block="Buffer offset %pOffset setBit 2** %exp %pBit" weight=1
    //% pOffset.defl=3
    //% exp.min=0 exp.max=7
    /* export function setBitBuffer(pOffset: number, exp: number, pBit: boolean) {
        n_Buffer19.setUint8(pOffset, setBit(n_Buffer19.getUint8(pOffset), exp, pBit))
    } */

    // ========== group="Logik" advanced=true

    //% group="Logik" advanced=true
    //% block="%i0 zwischen %i1 und %i2" weight=1
    export function between(i0: number, i1: number, i2: number): boolean {
        return (i0 >= i1 && i0 <= i2)
    }



    // ========== group="Text" advanced=true

    //% group="Text" advanced=true
    //% block="// %text" weight=9
    export function comment(text: string): void { }

    //% group="Text" advanced=true
    //% block="format %pText || Länge %len %pAlign" weight=7
    //% len.min=1 len.max=20 len.defl=4
    export function format(pText: any, len?: number, pAlign?: eAlign) {
        let text: string = convertToText(pText)
        if (text.length > len)
            text = text.substr(0, len)
        else if (text.length < len && pAlign == eAlign.right)
            text = "                    ".substr(0, len - text.length) + text
        else if (text.length < len)
            text = text + "                    ".substr(0, len - text.length)
        return text
    }

    //% group="Text" advanced=true
    //% block="hex %a" weight=6
    export function hex(a: number[]) {
        return Buffer.fromArray(a).toHex()
    }

    //% group="Text" advanced=true
    //% block="bin %n || Länge %len" weight=5
    //% length.min=2 length.max=8 len.defl=2
    export function bin(n: number, len?: number) {
        let ht: string = ""
        let hi: number = Math.trunc(n)
        while (hi > 0) {
            ht = "01".charAt(hi % 2) + ht
            hi = hi >> 1
        }
        return ("00000000" + ht).substr(-len) // Anzahl Binärziffern von rechts
    }



    // ========== ENUMs

    export enum eAlign {
        //% block="linksbündig"
        left,
        //% block="rechtsbündig"
        right
    }
    export enum eJoystickValue { x, y, motor, servo }
    export enum eXY { x, y }

} // car4sender.ts
