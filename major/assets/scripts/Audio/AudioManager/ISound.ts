export interface ISound {

    /**
     * 初始化
     * 根据微信和Web执行对应逻辑
     */
    init(): void;

    /**
     * 音频开关
     */
    switchAudio(): void
    /**
     * 背景音乐开关
     */
    switchMusic(): void;

    /**
     * 音效开关
     */
    switchSound(): void;

    /**
     * 播放声音
     * **非频繁、背景、循环声音**
     * @param url
     */
    playSound(audio: cc.AudioClip): void;

    /**
     * 循环播放声音
     * **仅限循环的声音**
     * @param url 
     */
    playSoundLoop(audio: cc.AudioClip): any;

    /**
     * 播放声音
     * - 限制次数
     */
    playSoundLimit(audio: cc.AudioClip, volume: number): void;

    /**
     * 播放背景音乐
     */
    playMusic(audio: cc.AudioClip): void;

    /**
     * 停止循环的声音
     */
    stopSoundLoop(audio: cc.AudioClip): void;

    /**
     * 停止背景音乐
     */
    stopMusic(): void;
}