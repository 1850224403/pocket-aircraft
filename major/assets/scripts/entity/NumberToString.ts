const { ccclass, property } = cc._decorator;

@ccclass
export class NumberToString extends cc.Component {

    public static getShotNumberStr(number: number): string {
        return number.toFixed(1);
    }

    public static getFloatNumberStr(number: number): string {

        let show = "";
        let floatStr = "p";

        if (number < 10000) {
            return show + number;
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "k";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "m";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "b";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "t";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "kt";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "mt";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "bt";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "tt";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);
        if (number < 10000) {
            return show + number + floatStr + "ktt";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);
        if (number < 10000) {
            return show + number + floatStr + "mtt";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);
        if (number < 10000) {
            return show + number + floatStr + "btt";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "ttt";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "kttt";
        }

        floatStr = 'p' + (Math.floor(number / 100) % 10).toString().substr(0, 1);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "mttt";
        }
    }
}
