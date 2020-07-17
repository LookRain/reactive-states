export declare const isObject: (val: unknown) => val is Record<any, any>;
export declare function unwatch(myFunc: () => any): () => void;
export declare function effect(eff: () => any): void;
export declare function reactive<T extends Record<string, unknown>>(target: T): T;
