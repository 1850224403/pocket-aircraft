import { GameCommonHttp } from "./GameCommonHttp";

declare global {
    interface Window {
        wxFs: any;
        hex_md5: any;
        wx: any;
    }
    export let wx: any;
}

export class GameCommonUtil {

    //随机获取32位的uuid
    public static uuid(): string {

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

        var uuid = [], i;

        var radix = 16 || chars.length;

        for (i = 0; i < 32; i++) uuid[i] = chars[0 | Math.random() * radix];

        return uuid.join('');
    }

    public static isToday(time: number): boolean {
        console.log(new Date(time).toDateString());
        console.log(new Date().toDateString());
        if (new Date(time).toDateString() === new Date().toDateString()) {
            //今天
            return true
        }
        return false;
    }

    public static getTextureByUrl(url: string, callBack: (texture: cc.Texture2D) => void): void {

        if (url == null || callBack == null) {
            return;
        }

        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            cc.loader.load(url, function (err, tex) {
                if (err) {
                    console.error(err);
                } else {
                    callBack && callBack(tex);
                }
            });
            return;
        }

        this.imageLoadTool(url, callBack);
    }

    public static imageLoadTool(url: string, callBack: (texture: cc.Texture2D) => void) {
        if (!window.wx) {
            return;
        }
        var dirpath = wx.env.USER_DATA_PATH + '/customHeadImage';
        let md5URL = window.hex_md5(url);

        var filepath = dirpath + "/" + md5URL + '.png';
        // console.log("url to filepath ", url, filepath);

        function loadEnd() {
            cc.loader.load(filepath, function (err, tex) {
                if (err) {
                    console.error(err);
                } else {
                    callBack && callBack(tex);
                }
            });
        }

        window.wxFs.exists(filepath, (exists: boolean) => {
            if (exists) {
                // console.log('already cache :' + url);
                loadEnd();
            }
            else {
                window.wxFs.downloadFile(url, (err: Error, res) => {
                    if (err != null) {
                        console.error(err);
                        return;
                    }
                    window.wxFs.exists(dirpath, (exists: boolean) => {
                        var copy = function () {
                            if (res.tempFilePath) {
                                window.wxFs.copyFile(res.tempFilePath, filepath, (err) => {
                                    if (err) {
                                        console.error("copy file failed:", err);
                                        return;
                                    }
                                    // console.log('download success and  cache at:' + filepath);
                                    loadEnd();
                                });
                            }
                        }
                        if (exists) {
                            copy();
                        }
                        else {
                            window.wxFs.makeDirSync(dirpath, false);
                            copy();
                        }
                    });
                });
            }
        });
    }

    /**
     * 比较两个版本号的大小
     * @param v1 
     * @param v2 
     * @return 0:相等，1:v1>v2,2:v2>1
     */
    public static compareVersion(v1: string, v2: string): number {
        if (v1 == null || v2 == null) {
            return 0;
        }
        let v1Array = v1.split('.')
        let v2Array = v2.split('.')
        const len = Math.max(v1Array.length, v2Array.length)

        while (v1Array.length < len) {
            v1Array.push('0')
        }
        while (v2Array.length < len) {
            v2Array.push('0')
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1Array[i])
            const num2 = parseInt(v2Array[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }

        return 0
    }
}
