import { LogUtil } from "../util/LogUtil";
import { PrefabPathEnum, FramePathEnum } from "../const/ResPathEnum";

/*
 * @Author: FeiFan Chen
 * @Date: 2019-11-26 10:01:12
 * @Description: 资源管理
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-13 00:39:29
 */
export class ResourcesManager {

    private _prefabMap: Map<string, cc.Prefab> = new Map();

    private _frameMap: Map<string, cc.SpriteFrame> = new Map();

    private _textureMap: Map<string, cc.Texture2D> = new Map();

    private _audioMap: Map<string, cc.AudioClip> = new Map();

    private _spineMap: Map<string, sp.SkeletonData> = new Map();

    public preloadRes(): Promise<any> {
        let self = this;
        return new Promise(function (resolve, reject) {
            let loadTypeCount = 3;

            let prefabPaths = [
                PrefabPathEnum.ROLE,
                PrefabPathEnum.ENEMY,
                PrefabPathEnum.BULLET + '01',
                PrefabPathEnum.COIN,
            ];
            let framePaths = [
                FramePathEnum.ENEMY + '01',
                FramePathEnum.ENEMY + '02',
                FramePathEnum.ENEMY + '03',
                FramePathEnum.ENEMY + '04',
                FramePathEnum.ENEMY + '05',
                FramePathEnum.ENEMY + '06',
                FramePathEnum.ENEMY + '07',
                FramePathEnum.ENEMY + '08',
                FramePathEnum.ENEMY + '09',
                FramePathEnum.ENEMY + '10',
                FramePathEnum.ENEMY + '11',
                FramePathEnum.ENEMY + '12',
                FramePathEnum.ENEMY + '13',
                FramePathEnum.ENEMY + '14',
                FramePathEnum.ENEMY + '15',
                FramePathEnum.ENEMY + '16',
                FramePathEnum.BACKGROUND + '1',
                FramePathEnum.BACKGROUND + '2',
                FramePathEnum.BACKGROUND + '3',
                FramePathEnum.BACKGROUND + '4',
                FramePathEnum.BACKGROUND + '5',
                FramePathEnum.BACKGROUND + '6',
                FramePathEnum.BACKGROUND + '7',
                FramePathEnum.BACKGROUND + '8',
                FramePathEnum.BACKGROUND + '9',
                FramePathEnum.BACKGROUND + '10',
                FramePathEnum.COUNTDOWN + '0',
                FramePathEnum.COUNTDOWN + '1',
                FramePathEnum.COUNTDOWN + '2',
                FramePathEnum.COUNTDOWN + '3',
                FramePathEnum.PIC_NUMBER + '0',
                FramePathEnum.PIC_NUMBER + '1',
                FramePathEnum.PIC_NUMBER + '2',
                FramePathEnum.PIC_NUMBER + '3',
                FramePathEnum.PIC_NUMBER + '4',
                FramePathEnum.PIC_NUMBER + '5',
                FramePathEnum.PIC_NUMBER + '6',
                FramePathEnum.PIC_NUMBER + '7',
                FramePathEnum.PIC_NUMBER + '8',
                FramePathEnum.PIC_NUMBER + '9',
                FramePathEnum.PIC_NUMBER + 'p',
                FramePathEnum.PIC_NUMBER + 'k',
                FramePathEnum.PIC_NUMBER + 'm',
                FramePathEnum.PIC_NUMBER + 'b',
                FramePathEnum.PIC_NUMBER + 't',
                FramePathEnum.PIC_NUMBER + 'line',
            ];
            let audioPaths = [
            ];

            function completeCall() {
                loadTypeCount--;
                if (loadTypeCount <= 0) {
                    resolve();
                }
            }

            let prefabCall = (e: Error, resArray: cc.Prefab[]) => {
                if (e) {
                    LogUtil.err(e);
                    reject();
                    return;
                }
                for (let i = 0; i < resArray.length; i++) {
                    const res = resArray[i];
                    const path = prefabPaths[i];
                    self._prefabMap.set(path, res);
                }
                completeCall();
            };
            cc.loader.loadResArray(prefabPaths, cc.Prefab, prefabCall);

            let frameCall = (e: Error, resArray: cc.SpriteFrame[]) => {
                if (e) {
                    LogUtil.err(e);
                    reject();
                    return;
                }
                for (let i = 0; i < resArray.length; i++) {
                    const res = resArray[i];
                    const path = framePaths[i];
                    self._frameMap.set(path, res);
                }
                completeCall();
            };
            cc.loader.loadResArray(framePaths, cc.SpriteFrame, frameCall);

            let audioCall = (e: Error, resArray: cc.AudioClip[]) => {
                if (e) {
                    LogUtil.err(e);
                    reject();
                    return;
                }
                for (let i = 0; i < resArray.length; i++) {
                    const res = resArray[i];
                    const path = audioPaths[i];
                    self._audioMap.set(path, res);
                }
                completeCall();
            };
            cc.loader.loadResArray(audioPaths, cc.AudioClip, audioCall);
        });
    }

    public loadPrefab(path: string, callback: Function): void {
        let res = this._prefabMap.get(path);
        if (res) {
            callback && callback(res);
            return;
        }
        let completeCall = (e: Error, res: cc.Prefab) => {
            if (e) {
                LogUtil.err(e);
                callback && callback(null);
                return;
            }
            this._prefabMap.set(path, res);
            callback && callback(res);
        }
        cc.loader.loadRes(path, cc.Prefab, completeCall);
    }

    public getPrefab(path: string): cc.Prefab {
        let res = this._prefabMap.get(path);
        if (!res) {
            return null;
        }
        return res;
    }

    public loadFrame(path: string, callback: Function): void {
        let res = this._frameMap.get(path);
        if (res) {
            callback && callback(res);
            return;
        }
        let completeCall = (e: Error, res: cc.SpriteFrame) => {
            if (e) {
                LogUtil.err(e);
                callback && callback(null);
                return;
            }
            this._frameMap.set(path, res);
            callback && callback(res);
        }
        cc.loader.loadRes(path, cc.SpriteFrame, completeCall);
    }

    public getFrame(path: string): cc.SpriteFrame {
        let res = this._frameMap.get(path);
        if (!res) {
            return null;
        }
        return res;
    }

    public getTexture2D(path: string, callback: Function): void {
        let res = this._textureMap.get(path);
        if (res) {
            callback && callback(res);
            return;
        }
        let completeCall = (e: Error, res: cc.Texture2D) => {
            if (e) {
                LogUtil.err(e);
                callback && callback(null);
                return;
            }
            this._textureMap.set(path, res);
            callback && callback(res);
        }
        cc.loader.loadRes(path, cc.Texture2D, completeCall);
    }

    public loadAudio(path: string, callback: Function): void {
        let res = this._audioMap.get(path);
        if (res) {
            callback && callback(res);
            return;
        }
        let completeCall = (e: Error, res: cc.AudioClip) => {
            if (e) {
                LogUtil.err(e);
                callback && callback(null);
                return;
            }
            this._audioMap.set(path, res);
            callback && callback(res);
        }
        cc.loader.loadRes(path, cc.AudioClip, completeCall);
    }

    public getAudio(path: string): cc.AudioClip {
        let res = this._audioMap.get(path);
        if (!res) {
            return null;
        }
        return res;
    }

    public getSpine(path: string): sp.SkeletonData {
        let res = this._spineMap.get(path);
        if (!res) {
            LogUtil.err('can not fin skeleton data with path: ', path);
            return null;
        }
        return res;
    }

}