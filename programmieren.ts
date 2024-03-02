
namespace car4sender
/*
*/ { // programmieren.ts

    // ========== deprecated

    //% group="Programmieren" subcategory="Programmieren"
    //% block="Motor- %motor Servo %servo Strecke %strecke cm" weight=7 deprecated=1
    //% motor.shadow="speedPicker" servo.shadow="protractorPicker" servo.defl=90
    //% strecke.min=1 strecke.max=255 strecke.defl=20
    export function programmBlock(motor: number, servo: number, strecke: number) {
        return Buffer.fromArray([
            Math.round(Math.map(motor, -100, 100, 0, 255)),
            Math.round(Math.map(servo, 0, 180, 31, 1)),
            strecke
        ])
    }



    // ========== group="programmieren" subcategory="Programmieren"

    //% group="programmieren" subcategory="Programmieren"
    //% block="Programm 'Fahrplan' | Schritt 1 %p1 Schritt 2 %p2 Schritt 3 %p Schritt 4 %p4 Schritt 5 %p5" weight=8
    //% p1.shadow="car4sender_programmSchritt"
    export function programm6(p1: Buffer, p2: Buffer, p3: Buffer, p4: Buffer, p5: Buffer,) {
        let rBuffer = Buffer.create(19)

        //if (p0) rBuffer.write(eBufferPointer.p0, p0.slice(0, 2)) // 1-2 (3 bleibt frei)
        if (p1) rBuffer.write(eBufferPointer.p1, p1) // 4-5-6
        if (p2) rBuffer.write(eBufferPointer.p2, p2)
        if (p3) rBuffer.write(eBufferPointer.p3, p3)
        if (p4) rBuffer.write(eBufferPointer.p4, p4)
        if (p5) rBuffer.write(eBufferPointer.p5, p5) // 16-17-18

        n_sendBuffer19 = rBuffer
    }

    //% blockId=car4sender_programmSchritt
    //% group="programmieren" subcategory="Programmieren"
    //% block="Motor %motor Servo %servo Strecke %strecke cm" weight=6
    //% motor.shadow="speedPicker"
    //% servo.shadow="protractorPicker" servo.defl=90
    //% strecke.min=0 strecke.max=255 strecke.defl=20
    export function programmSchritt(motor: number, servo: number, strecke: number) {
        return Buffer.fromArray([
            Math.round(Math.map(motor, -100, 100, 0, 255)),
            Math.round(Math.map(servo, 0, 180, 31, 1)),
            strecke
        ])
    }



    // ========== group="Eingabe Tastatur" subcategory="Programmieren"

    //% group="Eingabe Tastatur" subcategory="Programmieren"
    //% block="Motor (-100 ↓ 0 ↑ 100) %motor Servo (1 ↖ 16 ↗ 31) %servo Strecke (0..255) %strecke cm"
    //% motor.defl=0
    //% servo.defl=16
    //% strecke.defl=20
    export function programmSchrittT(motor: number, servo: number, strecke: number) {
        // constrain: speed zwischen -100 und +100 begrenzen
        // map: -100 -> 0 / 0 -> 127,5 / +100 -> 255
        // ceil: aufrunden, damit 127,5 = 128 = 0x80 Motor Stillstand
        return Buffer.fromArray([
            Math.ceil(Math.map(Math.constrain(motor, -100, 100), -100, 100, 0, 255)),
            Math.constrain(32 - servo, 1, 31),
            Math.constrain(strecke, 0, 255)
        ])
    }


    // ========== group="Bluetooth senden"  subcategory="Programmieren" color=#E3008C

    //% group="Bluetooth senden"  subcategory="Programmieren" color=#E3008C
    //% block="Programm senden und los fahren"
    export function sendProgramm19() {
        sendBuffer0_setBit(eBufferBit.fahrenStrecke, true)
        sendBuffer0_setBit(eBufferBit.x80_MotorPower, true)

        if (!n_Simulator)
            radio.sendBuffer(n_sendBuffer19)
    }


    // ========== group="anzeigen" subcategory="Programmieren"

    //% group="anzeigen" subcategory="Programmieren"
    //% block="Buffer 3 Byte dez anzeigen %b"
    export function printBuffer(b: Buffer) {
        return b.getUint8(0).toString() + "°" + b.getUint8(1).toString() + "°" + b.getUint8(2).toString()
    }

} // programmieren.ts
