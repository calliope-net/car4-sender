
namespace car4sender
/*
*/ { // advanced.ts


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
    
} //advanced.ts
