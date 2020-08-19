function 簡化動作 () {
    while (true) {
        修正索引值 = 動作.indexOf(3)
        if (修正索引值 == -1) {
            break;
        }
        if (動作[修正索引值 - 1] + 動作[修正索引值 + 1] == 1) {
            動作.removeAt(修正索引值)
            動作.removeAt(修正索引值)
            動作[修正索引值 - 1] = 2
        } else if (動作[修正索引值 - 1] + 動作[修正索引值 + 1] == 2) {
            動作.removeAt(修正索引值)
            動作.removeAt(修正索引值)
            動作[修正索引值 - 1] = 0
        } else if (動作[修正索引值 - 1] + 動作[修正索引值 + 1] == 3 || 動作[修正索引值 - 1] + 動作[修正索引值 + 1] == 0) {
            動作.removeAt(修正索引值)
            動作.removeAt(修正索引值)
            動作[修正索引值 - 1] = 3
        }
    }
    music.playTone(262, music.beat(BeatFraction.Whole))
}
function PD清除 () {
    errold = 0
}
input.onButtonPressed(Button.A, function () {
    basic.pause(1000)
    i = 0
    while (true) {
        控制(0)
        if (DATA == 1 || DATA == 5 || DATA == 3 || DATA == 7) {
            控制(1)
            動作[i] = 1
        } else if (DATA == 2) {
            控制(2)
            動作[i] = 2
        } else if (DATA == 4) {
            控制(3)
            動作[i] = 3
        } else if (DATA == 6) {
            動作[i] = 0
        } else if (DATA == 8) {
            控制(4)
            動作[i] = 4
            簡化動作()
            break;
        }
        i += 1
    }
})
input.onButtonPressed(Button.AB, function () {
    if (取值 == 0) {
        basic.pause(1000)
        取值 = 1
        BitRacer.CalibrateBegin()
        BitRacer.motorRun(BitRacer.Motors.All, 200)
        basic.pause(600)
        BitRacer.motorRun(BitRacer.Motors.All, 0)
        music.playTone(262, music.beat(BeatFraction.Eighth))
        BitRacer.CalibrateEnd(BitRacer.LineColor.White)
    } else {
        for (let index = 0; index <= i; index++) {
            basic.showNumber(動作[index])
            basic.pause(50)
            basic.clearScreen()
            basic.pause(25)
        }
    }
})
input.onButtonPressed(Button.B, function () {
    basic.pause(1000)
    i = 0
    while (true) {
        控制(0)
        if (動作[i] != 0) {
            控制(動作[i])
            if (動作[i] == 4) {
                break;
            }
        }
        i += 1
    }
})
// 路口
// 
// 0 = 直線
// 
// 1 = 左彎
// 
// 2 = 右彎
// 
// 3 = T字
// 
// 4 = 死路
// 
// 5 = 左卜
// 
// 6 = 右卜
// 
// 7 = 十字
// 
// 8 = 終點
function 讀取紅外線 () {
    for (let index = 0; index <= 4; index++) {
        紅外線[index] = BitRacer.readIR2(index)
    }
}
// 左轉：8
// 
// 左卜：7
// 
// T字：6
// 
// 十字：5
// 
// 右卜：4
// 
// 右轉：3
// 
// 終點：2
// 
// 死路：1
function 路口判斷 () {
    紅外線L狀態 = 0
    紅外線R狀態 = 0
    while (true) {
        讀取紅外線()
        if (紅外線[2] > 1200) {
            紅外線M狀態 = 1
        } else {
            紅外線M狀態 = 0
        }
        if (紅外線[4] > 1200) {
            紅外線R狀態 = 1
        }
        if (紅外線[0] > 1200) {
            紅外線L狀態 = 1
        }
        if (紅外線[0] > 1200 && 紅外線[2] > 1200 && 紅外線[4] > 1200) {
            終點Time += 1
            if (終點Time > 55) {
                終點Time = 0
                // 終點
                DATA = 8
                break;
            }
        } else {
            終點Time = 0
        }
        if (紅外線[0] < 500 && 紅外線L狀態 == 1 && 紅外線R狀態 == 1 && 紅外線[4] < 500) {
            if (紅外線M狀態 == 1) {
                // 十字
                DATA = 7
                break;
            } else {
                // T字
                DATA = 3
                break;
            }
        }
        if (紅外線[0] < 500 && 紅外線L狀態 == 1 && 紅外線R狀態 == 0) {
            if (紅外線M狀態 == 1) {
                // 左卜
                DATA = 5
                break;
            } else {
                // 左彎
                DATA = 1
                break;
            }
        }
        if (紅外線[4] < 500 && 紅外線L狀態 == 0 && 紅外線R狀態 == 1) {
            if (紅外線M狀態 == 1) {
                // 右卜
                DATA = 6
                break;
            } else {
                // 右彎
                DATA = 2
                break;
            }
        }
        if (紅外線[2] < 500 && (紅外線[1] < 500 && 紅外線[3] < 500) && (紅外線L狀態 == 0 && 紅外線R狀態 == 0)) {
            // 死路
            DATA = 4
            break;
        }
    }
}
// 直走：0
// 
// 左轉：1
// 
// 右轉；2
function 控制 (Mode: number) {
    PD清除()
    if (Mode == 0) {
        判斷Time = 0
        while (true) {
            PD控制(320, 250, 140)
            讀取紅外線()
            判斷Time += 1
            if (判斷Time > 判斷Delay && (紅外線[0] > 1200 || 紅外線[4] > 1200 || 紅外線[1] < 500 && 紅外線[2] < 500 && 紅外線[3] < 500)) {
                BitRacer.motorRun(BitRacer.Motors.All, 50)
                break;
            }
        }
        路口判斷()
    } else if (Mode == 1) {
        BitRacer.LED(BitRacer.LEDs.LED_L, BitRacer.LEDswitch.on)
        while (true) {
            BitRacer.motorRun(BitRacer.Motors.M_R, 轉彎PWM)
            BitRacer.motorRun(BitRacer.Motors.M_L, 0 - 轉彎PWM)
            轉彎Time += 1
            if (轉彎Time >= 轉彎Delay && BitRacer.readIR(BitRacer.IR_Sensors.IR1) >= 1200) {
                轉彎Time = 0
                while (true) {
                    PD控制(0, 220, 250)
                    if (線位置 >= -0.3 && 線位置 <= 0.3) {
                        BitRacer.motorRun(BitRacer.Motors.All, 0)
                        break;
                    }
                }
                break;
            }
        }
        BitRacer.LED(BitRacer.LEDs.LED_L, BitRacer.LEDswitch.off)
    } else if (Mode == 2 || Mode == 3) {
        BitRacer.LED(BitRacer.LEDs.LED_R, BitRacer.LEDswitch.on)
        while (true) {
            BitRacer.motorRun(BitRacer.Motors.M_R, 0 - 轉彎PWM)
            BitRacer.motorRun(BitRacer.Motors.M_L, 轉彎PWM)
            轉彎Time += 1
            if (轉彎Time >= 轉彎Delay && BitRacer.readIR(BitRacer.IR_Sensors.IR5) >= 1200) {
                轉彎Time = 0
                while (true) {
                    PD控制(0, 220, 250)
                    if (線位置 >= -0.3 && 線位置 <= 0.3) {
                        BitRacer.motorRun(BitRacer.Motors.All, 0)
                        break;
                    }
                }
                break;
            }
        }
        BitRacer.LED(BitRacer.LEDs.LED_R, BitRacer.LEDswitch.off)
    } else if (Mode == 4) {
        BitRacer.motorRun(BitRacer.Motors.All, 0)
    }
}
function PD控制 (基礎速度: number, kp: number, kd: number) {
    線位置 = BitRacer.readLine()
    err = 0 - 線位置
    ekd = err - errold
    errold = err
    PD_Val = kp * err + kd * ekd
    BitRacer.motorRun(BitRacer.Motors.M_L, 基礎速度 - PD_Val)
    BitRacer.motorRun(BitRacer.Motors.M_R, 基礎速度 + PD_Val)
}
let PD_Val = 0
let ekd = 0
let err = 0
let 線位置 = 0
let 轉彎Time = 0
let 判斷Time = 0
let 終點Time = 0
let 紅外線M狀態 = 0
let 紅外線R狀態 = 0
let 紅外線L狀態 = 0
let DATA = 0
let errold = 0
let 修正索引值 = 0
let 動作: number[] = []
let 轉彎PWM = 0
let i = 0
let 判斷Delay = 0
let 轉彎Delay = 0
let 紅外線: number[] = []
let 取值 = 0
取值 = 0
let index2 = 0
let 簡化過 = [30]
紅外線 = [5]
轉彎Delay = 100
判斷Delay = 40
i = 0
轉彎PWM = 390
動作 = [30]
serial.redirectToUSB()
