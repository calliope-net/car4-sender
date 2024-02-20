// Gib deinen Code hier ein
namespace car4sender
/*
*/ { // bluetooth.ts

    let n_sendBuffer19 = Buffer.create(19) // wird gesendet mit radio.sendBuffer
    //  let n_x: number, n_y: number, n_xMotor: number, n_yServo: number
    // let n_xmin = 128, n_xmax = 128, n_ymin = 128, n_ymax = 128

    export enum eBufferPointer {
        p0 = 1, p1 = 4, p2 = 7, p3 = 10, p4 = 13, p5 = 16
    }
    let n_BufferPointer: eBufferPointer = eBufferPointer.p0 // n=0..5 (n*3)+1 = 1, 4, 7, 10, 13, 16

    export enum eBufferOffset { // 3 Byte (b0-b1-b2) ab n_BufferPointer
        b0_Motor, // 0..128..255
        b1_Servo, // Bit 4-0 (0..31)
        b2_Fahrstrecke, // Encoder in cm max. 255cm
        b1_Bits // Bit 7-6-5
    }

    export enum eBufferBit {
        //% block="x80 Motor Power"
        x80_MotorPower = 0x80,
        //% block="x40 Hupe"
        x40_Hupe = 0x40,
    }


    //% group="Bluetooth senden" subcategory="Bluetooth" color=#E3008C
    //% block="Datenpaket senden" weight=9
    export function sendBuffer19() {
        n_sendBuffer19.setUint8(0, n_xMotor)
        n_sendBuffer19.setUint8(1, n_yServo)
        if (!n_Simulator)
            radio.sendBuffer(n_sendBuffer19)
    }

    //% group="Datenpaket vorbereiten" subcategory="Bluetooth" color=#E3008C
    //% block="Byte schreiben %pOffset %pByte || %pBufferPointer " weight=7
    export function sendBuffer_setUint8(pBufferOffset: eBufferOffset, pByte: number, pBufferPointer?: eBufferPointer) {
        if (!pBufferPointer) pBufferPointer = n_BufferPointer // wenn nicht angegeben internen Wert nehmen
        switch (pBufferOffset) {
            case eBufferOffset.b1_Servo: n_sendBuffer19.setUint8(pBufferPointer + pBufferOffset, Math.round(pByte / 3 - 14) & 0b00011111)
            //return ((r & 0b00011111) + 14) * 3 // Servo 1..31 +14 15..45 *3 45..135
            //case eBufferOffset.b1_Bits:
            //return r >>> 5 // r & 0b11100000 // Bits 0..7
            default: n_sendBuffer19.setUint8(pBufferPointer + pBufferOffset, pByte) // b0_Motor und b2_Fahrstrecke 0..255
        }
    }

    //% group="Datenpaket vorbereiten" subcategory="Bluetooth" color=#E3008C
    //% block="Bit schreiben %pBufferBit %pBit" weight=1
    export function sendBuffer0_setBit(pBufferBit: eBufferBit, pBit: boolean) {
        if (pBit)
            n_sendBuffer19[0] |= pBufferBit // OR 0b10000000
        else
            n_sendBuffer19[0] &= ~pBufferBit // AND 0b01111111

        // n_sendBuffer19.setUint8(0, setBit(n_sendBuffer19.getUint8(0), pBufferBit, pBit))
    }

    /* function setBit(pInt: number, exp: number, pBit: boolean) {
        exp = Math.trunc(exp)
        if (between(exp, 0, 63)) {
            if (pBit)
                return pInt | 2 ** exp
            else
                return pInt & ~(2 ** exp)
        } else
            return pInt
    } */

} // bluetooth.ts