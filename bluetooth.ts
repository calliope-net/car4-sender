
namespace car4sender
/*
*/ { // bluetooth.ts

    export let n_sendBuffer19 = Buffer.create(19) // wird gesendet mit radio.sendBuffer

    export enum eBufferPointer {
        p0 = 1, p1 = 4, p2 = 7, p3 = 10, p4 = 13, p5 = 16
    }
    let n_BufferPointer: eBufferPointer = eBufferPointer.p0 // n=0..5 (n*3)+1 = 1, 4, 7, 10, 13, 16

    export enum eBufferOffset { // 3 Byte (b0-b1-b2) ab n_BufferPointer
        b0_Motor = 0, // 0..128..255
        b1_Servo = 1, // Bit 4-0 (0..31)
        b2_Fahrstrecke = 2, // Encoder in cm max. 255cm
        b1_3Bit = 3 // Bit 7-6-5
    }

    export enum eBufferBit {
        //% block="Motor Power"
        x80_MotorPower = 0x80,
        //% block="Hupe"
        x40_Hupe = 0x40,
        //% block="connected & fahren Joystick"
        //fahrenJostick = 0x00,
        //% block="fahren Strecke"
        fahrenStrecke = 0x01
    }



    // ========== group="Datenpaket vorbereiten" subcategory="Bluetooth" color=#E3008C

    //% group="Datenpaket vorbereiten" subcategory="Bluetooth" color=#E3008C
    //% block="Byte schreiben %pOffset %pByte || %pBufferPointer " weight=7
    export function sendBuffer_setUint8(pBufferOffset: eBufferOffset, pByte: number, pBufferPointer?: eBufferPointer) {
        if (!pBufferPointer) pBufferPointer = n_BufferPointer // wenn nicht angegeben internen Wert nehmen
        switch (pBufferOffset) {
            case eBufferOffset.b1_Servo:
                n_sendBuffer19[pBufferPointer + 1] &= 0b11100000 // AND Bit 7-6-5 bleiben; 4-3-2-1-0 auf 0 setzen
                n_sendBuffer19[pBufferPointer + 1] |= (Math.round(pByte / 3 - 14) & 0b00011111) // OR Bit 7-6-5 bleiben; 4-3-2-1-0 auf Ergebnis setzen

                //n_sendBuffer19.setUint8(pBufferPointer + pBufferOffset, Math.round(pByte / 3 - 14) & 0b00011111)
                break
            case eBufferOffset.b1_3Bit:
                n_sendBuffer19[pBufferPointer + 1] &= 0b00011111 // AND Bit 4-3-2-1-0 bleiben; 7-6-5 auf 0 setzen
                n_sendBuffer19[pBufferPointer + 1] |= (pByte << 5) // OR Bit 4-3-2-1-0 bleiben
                break
            default: // b0_Motor und b2_Fahrstrecke 0..255
                n_sendBuffer19.setUint8(pBufferPointer + pBufferOffset, pByte)
                break
        }
    }

    //% group="Datenpaket vorbereiten" subcategory="Bluetooth" color=#E3008C
    //% block="Steuer-Byte 0 %pBufferBit %pBit" weight=1
    //% pBit.shadow="toggleOnOff"
    export function sendBuffer0_setBit(pBufferBit: eBufferBit, pBit: boolean) {
        if (pBit)
            n_sendBuffer19[0] |= pBufferBit // OR 0b10000000 Bit auf 1 setzen
        else
            n_sendBuffer19[0] &= ~pBufferBit // AND 0b01111111 Bit auf 0 setzen
    }



    // ========== group="Bluetooth senden" subcategory="Bluetooth" color=#E3008C

    //% group="Bluetooth senden" subcategory="Bluetooth" color=#E3008C
    //% block="Datenpaket senden" weight=9
    export function sendBuffer19() {
        if (!n_Simulator)
            radio.sendBuffer(n_sendBuffer19)
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