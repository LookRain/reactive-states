import * as React from 'react';
import { unwatch, effect, isObject } from './reactive-states';
export function Observer(props) {
    const { children } = props;
    const [, forceUpdate] = React.useState(1);
    const effectFn = React.useCallback(() => {
        children();
        forceUpdate((c) => c + 1);
    }, [children]);
    React.useEffect(() => {
        effect(effectFn);
        return unwatch(effectFn);
    }, [children]);
    return React.createElement("span", null, children());
}
function recursivelyAccess(obj) {
    if (Array.isArray(obj)) {
        obj.length;
        obj.forEach(recursivelyAccess);
        return;
    }
    if (isObject(obj)) {
        const keys = Object.keys(obj);
        keys.forEach((key) => {
            obj[key];
            if (isObject(obj[key])) {
                recursivelyAccess(obj[key]);
            }
        });
    }
}
export function useReactor(store) {
    const [, forceUpdate] = React.useState(1);
    const effectFn = React.useCallback(() => {
        recursivelyAccess(store);
        forceUpdate((c) => c + 1);
    }, []);
    React.useEffect(() => {
        effect(effectFn);
        return unwatch(effectFn);
    }, []);
}
export const watch = effect;
export function useWatcher(fn) {
    React.useEffect(() => {
        effect(fn);
        return unwatch(fn);
    }, [fn]);
}
//# sourceMappingURL=connect-reactive.js.map