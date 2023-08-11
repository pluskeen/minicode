interface IOptions {
    /** 是否立即执行 */
    immediately: boolean;
    /** 轮询函数需要的入参 */
    params: any[];
    /** 轮询间隔时间，单位秒 */
    delayTime: number;
    /** 上下文 */
    ctx: any;
}
declare class PollFetch {
    private defaultOptions;
    private options;
    private fn;
    private loop;
    private timeId;
    constructor(fn: (...args: any[]) => any, options?: IOptions);
    generateNewFn(fn: () => void | any, options: IOptions): any;
    timeoutPromise(): Promise<unknown>;
    syncPromise(): Promise<any>;
    exec(): Promise<void>;
    destroy(): void;
}

export { PollFetch };
