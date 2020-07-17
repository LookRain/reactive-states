/// <reference types="react" />
import { effect } from './reactive-states';
export declare function Observer(props: {
    children: () => any;
}): JSX.Element;
export declare function useReactor(store: Record<string, any>): void;
export declare const watch: typeof effect;
export declare function useWatcher(fn: () => any): void;
