/*
 * @Author: Feifan Chen 
 * @Date: 2019-11-09 14:19:46 
 * @Description: 打印log的工具类 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-02 15:02:05
 */
let OPENLOGFLAG = true;

export class LogUtil {

    public static log(...args): void {
        let logFun = console.log || cc.log;
        if (OPENLOGFLAG) {
            logFun.call(this, "%s:" + cc.js.formatStr.apply(cc, arguments), LogUtil.getDateString());
        }
    }

    public static info(...args): void {
        let logFun = console.log || cc.log;
        if (OPENLOGFLAG) {
            logFun.call(this, "%c%s:" + cc.js.formatStr.apply(cc, arguments), "color:#00CD00;", LogUtil.getDateString());
        }
    }

    public static warn(...args): void {
        let logFun = console.log || cc.log;
        if (OPENLOGFLAG) {
            logFun.call(this, "%c%s:" + cc.js.formatStr.apply(cc, arguments), "color:#ee7700;", LogUtil.getDateString());
        }
    }

    public static err(...args): void {
        let logFun = console.log || cc.log;
        if (OPENLOGFLAG) {
            logFun.call(this, "%c%s:" + cc.js.formatStr.apply(cc, arguments), "color:red", LogUtil.getDateString());
        }
    }

    private static stack(index): string {
        let e = new Error();
        let lines = e.stack.split("\n");
        lines.shift();
        let result = [];
        lines.forEach(function (line) {
            line = line.substring(7);
            let lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            } else {
                result.push({ [lineBreak[0]]: lineBreak[1] });
            }
        });

        let list = [];
        if (index < result.length - 1) {
            for (var a in result[index]) {
                list.push(a);
            }
        }

        let splitList = list[0].split(".");
        return (splitList[0] + ".ts->" + splitList[1] + ": ");
    }

    private static getDateString(): string {
        let d = new Date();
        let str = d.getHours().toString();
        let timeStr = "";
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMinutes().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getSeconds().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMilliseconds().toString();
        if (str.length == 1) str = "00" + str;
        if (str.length == 2) str = "0" + str;
        timeStr += str;

        timeStr = "[" + timeStr + "]";
        return timeStr;
    }

}