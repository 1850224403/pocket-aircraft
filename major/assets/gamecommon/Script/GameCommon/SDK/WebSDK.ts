import { ISDK } from "./ISDK";
import { SystemInfo } from "./WxSDK";
import { UserData } from "../UserData";

export class WebSDK implements ISDK {

    getSystemInfo(): SystemInfo {
        return null;
    }

    getLaunchOptions() {
        return null;
    }
    registerOnShow(callBack: (res: any) => void): void {
        if (callBack != null) {
            callBack(null);
        }
    }
    registerOnHide(callBack: () => void): void {
        if (callBack != null) {
            callBack();
        }
    }
    isPhoneXScreen(): boolean {
        return false;
    }
    appGameOnLanch(): void {

    }
    share(shareType: string, assistActivityId: string, extendInfos: Map<string, string>, callBack: (res: any, success: boolean) => void, tripleLie: boolean): void {
        if (callBack) {
            callBack(null, true);
        }
    }
    levelShare(shareType: string, callBack: (success: boolean, cancel: boolean) => void): void {
        if (callBack) {
            callBack(true, false);
        }
    }

    clearTripleLie(shareType: string): void {

    }

    navigateToMiniProgram(jumpAppId: string, jumpPath: string, callBack?: (success: boolean) => void): void {
        if (callBack) {
            callBack(false);
        }
    }

    vibrateShort(): void {
    }

    vibrateLong(): void {
    }

    wxInitData(): void {
    }

    setStorage(storageKey: string, storageData: string): void {
    }

    getStorage(storageKey: string): string {
        return null;
    }

    previewImage(url?: string, urls?: Array<string>): void {

    }

    showFeedbackButton(left: number, top: number, imagePath: string): void {

    }

    destroyFeedbackButton(): void {

    }

    showWxModal(title: string, content: string, confirmAction: () => void, cancelAction: () => void): void {

    }

    getMenuButtonBoundingClientRect(): any {
        return null;
    }

    showWxLoading(title: string, callBack: any, delayTime: number): void {

    }

    popWxAuthorization(successCall: (userInfo: any) => void, imagePath?: string, style?: any): void {
        
    }
}