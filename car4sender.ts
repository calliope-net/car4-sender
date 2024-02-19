//% color=#007F00 icon="\uf0d1" block="CaR 4 Sender" weight=28
//% groups='["beim Start","Motor","Servo"]'
namespace car4sender
/*
*/ {
    const i2cqwiicJoystick_x20 = 0x20

    const n_Simulator: boolean = ("€".charCodeAt(0) == 8364) // true, wenn der Code im Simulator läuft
    let n_Buffer19 = Buffer.create(19) // wird gesendet mit radio.sendBuffer
    let n_x: number, n_y: number, n_motor: number, n_servo: number

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
    export function sendBuffer19() {
        radio.sendBuffer(n_Buffer19)
    }


    //% group="Joystick"
    //% block="Joystick Werte lesen %pJoystickValue" weight=9
    export function joystickValues(pJoystickValue: eJoystickValue) {
        switch (pJoystickValue) {
            case eJoystickValue.x: return n_x
            case eJoystickValue.y: return n_y
            case eJoystickValue.motor: return n_motor
            case eJoystickValue.servo: return n_servo
            default: return 0
        }
    }

    //% group="Joystick"
    //% block="Joystick Qwiic" weight=8
    export function qwiicJoystick() {
        if (pins.i2cWriteBuffer(i2cqwiicJoystick_x20, Buffer.fromArray([3]), true) != 0)
            return false
        else {
            let bu = pins.i2cReadBuffer(i2cqwiicJoystick_x20, 3)
            n_x = bu.getUint8(0)
            n_y = bu.getUint8(2)
            // Motor
            if (between(n_x, 124, 132)) n_motor = 128
            else n_motor = n_x
            // Servo
            if (between(n_y, 122, 134)) n_servo = 90 // Ruhestellung soll 128 ist auf 128 = 90° anpassen
            else if (n_y < 20) n_servo = 135 // Werte < 20 wie 0 behandeln (max links)
            else if (n_y > 235) n_servo = 45 // Werte > 235 wie 255 behandeln (max rechts)
            else n_servo = Math.map(n_y, 20, 235, 134, 46) // Werte von 32 bis 991 auf 46° bis 134° verteilen
            return true
        }
    }



    // ========== advanced=true ==========

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

    export enum eJoystickValue {
        x, y, motor, servo
    }
} // car4sender.ts
